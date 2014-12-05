var Monitor = require('../models/monitor');


module.exports.controller = function (app) {

    app.get('/monitors', isAuthenticated, function (req, res) {
        Monitor.find({}, function (err, monitors) {
            if (err) {
                return util.renderError(err, res);
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
                        return util.renderError(err, res);
                    } else {
                        gen.start();
                        return res.redirect('/monitors');
                    }
                });
            } else {
                return util.renderError('bad input', res);
            }
        });

    app.get('/monitors/:id', isAuthenticated, function (req, res) {
        Monitor.findOne({_id: req.param('id')}, function (err, monitor) {
            if (err) {
                return util.renderError(err, res);
            }
            return res.render('monitors/show', {monitor: monitor})
        });
    });

    app.get('/monitors/:id/status/:count', isAuthenticated, function (req, res) {
        Monitor.findOne({_id: req.param('id')}, function (err, monitor) {
            if (err) {
                return util.renderError(err, res);
            }
            monitor.getResponses(function (err, responses) {
                if (err) {
                    return util.renderError(err, res);
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
        .get([isAuthenticated, isOwner], function (req, res) {
            var id = req.param('id');
            Monitor.findOne({_id: id}).exec(function (err, doc) {
                if (err) {
                    return util.renderError(err, res);
                }
                return res.render('monitors/confirmDelete', {monitor: doc});
            });
        })
        .post([isAuthenticated, isOwner], function (req, res) {
            var id = req.param('id');
            Monitor.findOne({_id: id}).exec(function (err, doc) {
                if (err) {
                    return util.renderError(err, res);
                }
                doc.removeResponses(function (err) {
                    if (err) {
                        return util.renderError(err, res);
                    }
                    doc.remove(function (err) {
                        if (err) {
                            return util.renderError(err, res);
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

    function isOwner(req, res, next) {
        var id = req.param('id');
        if (id) {
            Monitor.findOne({_id: id}, function (err, doc) {
                if (err) {
                    return util.renderError(err, res);
                }
                if (req.isAuthenticated() && req.user._id == doc.owner) {
                    return next();
                } else {
                    return util.renderError('you do not own that monitor', res);
                }
            });
        } else {
            return res.redirect('/monitors');
        }
    }

};