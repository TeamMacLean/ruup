var Monitor = require('../models/monitor');

module.exports.controller = function (app) {

    app.get('/monitors', isAuthenticated, function (req, res) {
        Monitor.find({}, function (err, monitors) {
            if (err) {
                return res.send(err);
            }
            return res.render('monitors/index', {monitors: monitors});
        });
    });

    app.route('/monitors/add')
        .get(isAuthenticated, function (req, res) {
            return res.render('monitors/add');
        })
        .post(isAuthenticated, function (req, res) {
            var nameInput = req.body.nameInput;
            var urlInput = req.body.urlInput;
            var rateInput = req.body.rateInput;

            var currentUser = req.user;

            if (nameInput && urlInput && rateInput && currentUser) {
                var userID = currentUser._id;
                var monitor = new Monitor({
                    name: nameInput,
                    url: urlInput,
                    rate: rateInput,
                    owner: userID
                });
                monitor.save(function (err, gen) {
                    if (err) {
                        return res.send(err);
                    } else {
                        gen.start();
                        return res.redirect('/monitors');
                    }
                });
            } else {
                return res.send('bad input');
            }
        });

    app.get('/monitors/:id', isAuthenticated, function (req, res) {
        Monitor.findOne({_id: req.param('id')}, function (err, monitor) {
            if (err) {
                return res.send(err);
            }
            return res.render('monitors/show', {monitor: monitor})
        });
    });

    app.get('/monitors/:id/status/:count', isAuthenticated, function (req, res) {
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

    app.route('/monitors/:id/delete')
        .get(isAuthenticated, function (req, res) {
            var id = req.param('id');
            Monitor.findOne({_id: id}).exec(function (err, doc) {
                if (err) {
                    return res.send(err);
                }
                res.render('monitors/confirmDelete', {monitor: doc});
            });
        })
        .post(isAuthenticated, function (req, res) {
            var id = req.param('id');
            Monitor.findOne({_id: id}).exec(function (err, doc) {
                if (err) {
                    return res.send(err);
                }
                doc.removeResponses(function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    doc.remove(function (err) {
                        if (err) {
                            return res.send(err);
                        }
                        return res.redirect('/monitors');
                    })
                })
            });
        });
    function isAuthenticated(req, res, next) {
        if (req.isUnauthenticated()) {
            return res.redirect('/');
        }
        return next();
    }
};