var Monitor = require('../models/monitor');

module.exports.controller = function (app) {

    app.get('/monitors', function (req, res) {
        Monitor.find({}, function (err, monitors) {
            if (err) {
                res.send(err);
            }
            res.render('monitors/index', {monitors: monitors});
        });
    });

    app.route('/monitors/add')
        .get(function (req, res) {
            res.render('monitors/add');
        })
        .post(function (req, res) {
            var nameInput = req.body.nameInput;
            var urlInput = req.body.urlInput;
            var rateInput = req.body.rateInput;

            if (nameInput && urlInput && rateInput) {
                var monitor = new Monitor({
                    name: nameInput,
                    url: urlInput,
                    rate: rateInput
                });
                monitor.save(function (err, gen) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.redirect('/monitors');
                    }
                });
            } else {
                res.send('bad input');
            }
        });

    app.get('/monitors/:id', function (req, res) {
        Monitor.findOne({_id: req.param('id')}, function (err, monitor) {
            if (err) {
                res.send(err);
            }
            res.render('monitors/show', {monitor: monitor})
        });
    });


};