const passport = require('passport');
// const LOG = require('../lib/log');
const renderError = require('../lib/renderError');

var Auth = {};

Auth.github = (req, res)=> {
    passport.authenticate('github');
};

Auth.githubCallback = (req, res)=> {
    passport.authenticate('github', {failureRedirect: '/login'});

    // passport.authenticate('github', (err, user, info) => {
    //     if (err) {
    //         LOG.error(err);
    //         return next(err);
    //     }
    //     if (!user) {
    //         let message = 'No such user';
    //         if (info && info.message) {
    //             message += `, ${info.message}`;
    //         }
    //         return renderError(message, res);
    //         //return res.render('error', {error: message});
    //     }
    //     req.logIn(user, err => {
    //         if (err) {
    //             return next(err);
    //         }
    //
    //         console.log('user here', user);
    //
    //         // req.user.iconURL = gravatar.url(req.user.mail) || config.defaultUserIcon;
    //
    //         //take them to the page they wanted before signing in :)
    //         // if (req.session.returnTo) {
    //         //     return res.redirect(req.session.returnTo);
    //         // } else {
    //         return res.redirect('/');
    //         // }
    //     });
    // })(req, res, next);

};


// Auth.signin = (req, res)=> {
//
// };
//
// Auth.signinPost = (rew, res)=> {
//     // passport.authenticate('github');
//     passport.authenticate('github', (err, user, info) => {
//         if (err) {
//             LOG.error(err);
//             return next(err);
//         }
//         if (!user) {
//             let message = 'No such user';
//             if (info && info.message) {
//                 message += `, ${info.message}`;
//             }
//             return renderError(message, res);
//         }
//         req.logIn(user, err => {
//             if (err) {
//                 return next(err);
//             }
//
//             // req.user.iconURL = gravatar.url(req.user.mail);
//
//             //take them to the page they wanted before signing in :)
//             if (req.session.returnTo) {
//                 return res.redirect(req.session.returnTo);
//             } else {
//                 return res.redirect('/');
//             }
//         });
//     })(req, res, next);
// };
// Auth.githubCallback = (req, res)=> {
// // passport.authenticate('github', {failureRedirect: '/login'}),
// //     function (req, res) {
// // Successful authentication, redirect home.
// // res.redirect('/');
// // });
// }
//
// // app.get('/auth/github/callback',


module.exports = Auth;