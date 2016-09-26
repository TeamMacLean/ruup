var Monitors = {};

const Monitor = require('../models/monitor');
const renderError = require('../lib/renderError');

Monitors.new = (req, res)=> {
    return res.render('monitor/edit')
};

Monitors.newPost = (req, res)=> {
    console.log(req.body);

    const name = req.body.name;
    const url = req.body.url;

    const userID = '';


    new Monitor({
        name,
        url,
        userID
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

module.exports = Monitors;