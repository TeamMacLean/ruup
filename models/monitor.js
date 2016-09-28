const thinky = require('../lib/thinky');
const type = thinky.type;
const badge = require('../lib/badge');


const Monitor = thinky.createModel('Monitor', {
    id: type.string(),
    name: type.string().required(),
    url: type.string().required(),
    email: type.string().required(),
    username: type.string().required(),
    up: type.boolean().default(true),
    upPercent: type.number().default(100),
    emailSent: type.boolean().default(false)
});

Monitor.define('getUpPercentBadge', function () {
    return badge.upPercent(this.name, this.upPercent);
});
Monitor.define('setStatusBadge', function () {
    return badge.status(this.name, this.up);
});
Monitor.define('getAvgResponseBadge', function () { //TODO

    return new Promise((good, bad)=> {
        Response.filter({monitorID: this.id, up: true}).run()
            .then((responses)=> {

                var respt = 0;

                responses.map((resp)=> {
                    respt += resp.time;
                });

                respt = respt / responses.length;

                badge.averageResponseTime(this.name, respt).then((svg)=> {
                    return good(svg);
                }).catch((err)=> {
                    return bad(err);
                })

            });
    })
});

module.exports = Monitor;
const Response = require('./response');
Monitor.hasMany(Response, 'responses', 'id', 'monitorID');