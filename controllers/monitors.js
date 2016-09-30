var Monitors = {};

const Monitor = require('../models/monitor');
const renderError = require('../lib/renderError');
const monitorCron = require('../lib/monitorCron');
// const badge = require('../lib/badge');
const moment = require('moment');

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
                return new Date(b.date) - new Date(a.date);
            })
                .map((val)=> {
                    return [val.date, val.time];
                });


            //SORT BY DATE
            // monitor.responses = monitor.responses.sort(function (a, b) {
            //     return new Date(b.date) - new Date(a.date);
            // }).slice(0, 50).reverse();
            //
            // var graph = {
            //     labels: [],
            //     data: []
            // };
            // monitor.responses.map(function (r) {
            //     graph.data.push({
            //         meta: moment(r.date).fromNow(), //19 minutes ago (exmaple)
            //         value: r.time //ms
            //     });
            //     // graph.labels.push(r.time)
            // });

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
