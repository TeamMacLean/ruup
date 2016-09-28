var Monitors = {};

const Monitor = require('../models/monitor');
const renderError = require('../lib/renderError');
const monitorCron = require('../lib/monitorCron');
// const badge = require('../lib/badge');
const moment = require('moment');

Monitors.new = (req, res)=> {
    return res.render('monitor/edit')
};

Monitors.newPost = (req, res)=> {
    const name = req.body.name;
    var url = req.body.url;
    const username = req.user.username;
    const email = req.user.emails[0].value;

    if (url.indexOf('//') > -1) {
        url = url.replace(/.*?:\/\//g, "http://");
    } else {
        url = 'http://' + url;
    }


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

            var graph = {
                labels: [],
                data: []
            };

            monitor.responses.map(function (r) {
                graph.data.push(r.time);
                graph.labels.push(
                    {
                        meta: moment(r.date).fromNow(),
                        value: r.time //ms
                    }
                )
            });

            return res.render('monitor/show', {monitor, graph});
        })
        .catch((err)=> {
            console.log('error:', err);
            return renderError(err, res);
        })
};


Monitors.edit = (req, res)=> {

};

Monitors.delete = (req, res)=> {

};

Monitors.upPercentBadge = (req, res)=> {
    var id = req.params.id;

    Monitor.get(id).run()
        .then((monitor)=> {
            monitor.getUpPercentBadge().then((svg)=> {
                return res.type('image/svg+xml').send(svg);
            }).catch(err=> {
                console.log(err)
            });
        })
        .catch((err)=> {
            console.log(err)
        })
};
Monitors.averageResponseBadge = (req, res)=> {
    var id = req.params.id;

    Monitor.get(id).run()
        .then((monitor)=> {
            monitor.getAvgResponseBadge().then((svg)=> {
                return res.type('image/svg+xml').send(svg);
            }).catch(err=> {
                console.log(err)
            });
        })
        .catch((err)=> {
            console.log(err)
        })
};

Monitors.statusBadge = (req, res)=> {
    var id = req.params.id;

    Monitor.get(id).run()
        .then((monitor)=> {
            monitor.getStatusBadge().then((svg)=> {
                return res.type('image/svg+xml').send(svg);
            }).catch(err=> {
                console.log(err)
            });
        })
        .catch((err)=> {
            console.log(err)
        })
};

module.exports = Monitors;