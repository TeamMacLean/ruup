var Monitors = {};

const Monitor = require('../models/monitor');
const renderError = require('../lib/renderError');
const badge = require('../lib/badge');

Monitors.new = (req, res)=> {
    return res.render('monitor/edit')
};

Monitors.newPost = (req, res)=> {
    const name = req.body.name;
    const url = req.body.url;
    const username = req.user.username;


    new Monitor({
        name,
        url,
        username
    })
        .save()
        .then(monitor=> {
            res.redirect('/site/' + monitor.id)
        })
        .catch(err=>renderError(err, res));

};

Monitors.mine = (req, res)=> {
    Monitor
        .run()
        // .get()
        .then(monitors=> {
            res.render('monitor/mine', {monitors});
        })
        .catch(err => renderError(err, res));
};

Monitors.show = (req, res)=> {

};


Monitors.edit = (req, res)=> {

};

Monitors.delete = (req, res)=> {

};

Monitors.getBadge = (req, res)=> {
    var site = req.params.site;
    badge.generate(site, Math.floor(Math.random() * 100) + 1 + '%').then(svg=> {
        res.send(svg);
    }).catch(err=> {
        console.log(err)
    })
};

module.exports = Monitors;