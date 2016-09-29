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
    avgResponseTime: type.number().default(null),
    emailSent: type.boolean().default(false)
});

Monitor.define('getUpPercentBadge', function () {
    return badge.upPercent(this.name, this.upPercent);
});
Monitor.define('getStatusBadge', function () {
    return badge.status(this.name, this.up);
});
Monitor.define('getAvgResponseBadge', function () {
    return badge.averageResponseTime(this.name, this.avgResponseTime);
});

module.exports = Monitor;
const Response = require('./response');
Monitor.hasMany(Response, 'responses', 'id', 'monitorID');