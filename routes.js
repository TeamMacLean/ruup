const express = require('express');
const router = express.Router();
const Monitors = require('./controllers/monitors');
const Auth = require('./controllers/auth');

router.route('/')
    .get((req, res) => {
        if (req.user) {
            return Monitors.mine(req, res)
        } else {
            return res.render('index');
        }
    });

router.route(['/auth/github', '/signin', '/login'])
    .get(Auth.github);
router.route('/auth/github/callback')
    .get(Auth.githubCallback);

router.route(['/signout', '/logout']).get((req, res) => {
    req.logout();
    res.redirect('/');
});

////Monitors
//new
router.route('/new')
    .all(isAuthenticated)
    .get(Monitors.new)
    .post(Monitors.newPost);
//show
router.route('/site/:id')
    .get(Monitors.show);
//badge up percent svg
router.route('/site/:id/badge/uppercent')
    .get(Monitors.upPercentBadge);
//badge svg
router.route('/site/:id/badge/avgresponse')
    .get(Monitors.averageResponseBadge);
//edit
router.route('/site/:id/edit')
    .all(isAuthenticated)
    .get(Monitors.edit)
    .all(isAuthenticated);
//delete TODO
router.route('/site/:id/delete')
    .get(Monitors.delete);

//catch all
router.route('/*')
    .get((req, res)=> {
        return res.render('404');
    });


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.session.returnTo = req.path;
        return res.redirect('/auth/github');
    }
}


module.exports = router;