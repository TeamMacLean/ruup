var Monitors = {};

const Monitor = require('../models/monitor');
const renderError = require('../lib/renderError');
const monitorCron = require('../lib/monitorCron');
const LOG = require('../lib/log');

Monitors.new = (req, res)=> {
    return res.render('monitor/edit')
};

function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

Monitors.newPost = (req, res)=> {
    const name = req.body.name;
    var url = req.body.url;
    const username = req.user.username;
    const email = req.user.emails[0].value;

    url = addhttp(url);

    new Monitor({
        name,
        url,
        username,
        email
    })
        .save()
        .then(monitor=> {
            monitorCron.add(monitor);
            return res.redirect('/site/' + monitor.id);
        })
        .catch(err=> {
            return renderError(err, res)
        });

};

Monitors.mine = (req, res)=> {

    var currentUsername = req.user.username;

    Monitor
        .filter({username: currentUsername})
        .run()
        .then(monitors=> {
            res.render('monitor/mine', {monitors});
        })
        .catch(err => renderError(err, res));
};

Monitors.show = (req, res)=> {
    var id = req.params.id;
    Monitor.get(id)
        .getJoin({responses: true})
        .run()
        .then((monitor)=> {

            var graph = monitor.responses.sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            })
                .map((val)=> {
                    return [val.date, val.time];
                });

            return res.render('monitor/show', {monitor, graph});
        })
        .catch((err)=> {
            LOG.error('error:', err);
            return renderError(err, res);
        })
};


Monitors.edit = (req, res)=> {

};

Monitors.delete = (req, res)=> {
    var id = req.params.id;
    Monitor.get(id)
        .then((monitor)=> {
            monitor.deleteAll({responses: true})
                .then(function (result) {
                    return res.redirect('/');
                }).catch((err)=> {
                return renderError(err);
            });
        })
        .catch((err)=> {
            return renderError(err);
        });
};

Monitors.upPercentBadge = (req, res)=> {
    var id = req.params.id;

    Monitor.get(id).run()
        .then((monitor)=> {
            monitor.getUpPercentBadge().then((svg)=> {
                return res.type('image/svg+xml').send(svg);
            }).catch(err=> {
                LOG.error(err)
            });
        })
        .catch((err)=> {
            LOG.error(err)
        })
};
Monitors.averageResponseBadge = (req, res)=> {
    var id = req.params.id;

    Monitor.get(id).run()
        .then((monitor)=> {
            monitor.getAvgResponseBadge().then((svg)=> {
                return res.type('image/svg+xml').send(svg);
            }).catch(err=> {
                LOG.error(err)
            });
        })
        .catch((err)=> {
            LOG.error(err)
        })
};

Monitors.statusBadge = (req, res)=> {
    var id = req.params.id;

    Monitor.get(id).run()
        .then((monitor)=> {
            monitor.getStatusBadge().then((svg)=> {
                return res.type('image/svg+xml').send(svg);
            }).catch(err=> {
                LOG.error(err)
            });
        })
        .catch((err)=> {
            LOG.error(err)
        })
};

module.exports = Monitors;
