var Monitor = require('../models/monitor');

module.exports.controller = function (app) {

    app.get('/monitors', function (req, res) {
        Monitor.find({}, function (err, monitors) {
            if (err) {
                return res.send(err);
            }
            return res.render('monitors/index', {monitors: monitors});
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
                        return res.send(err);
                    } else {
                        return res.redirect('/monitors');
                    }
                });
            } else {
                return res.send('bad input');
            }
        });

    app.get('/monitors/:id', function (req, res) {
        Monitor.findOne({_id: req.param('id')}, function (err, monitor) {
            if (err) {
                return res.send(err);
            }
            res.render('monitors/show', {monitor: monitor})
        });
    });

    app.get('/monitors/:id/status/:count', function (req, res) {
        Monitor.findOne({_id: req.param('id')}, function (err, monitor) {
            if (err) {
                return res.send(err);
            }
            monitor.getResponses(function (err, responses) {
                if (err) {
                    return res.send(err);
                }

                var count = req.param('count');
                var out = responses;

                if (responses.length >= count) {
                    out = responses.slice(0, count);
                }
                return res.send(out);
            });

        });
    });


};