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

Monitor.define('getgetUpPercentBadgeUpPercentBadge', function () {
    return badge.upPercent(this.name, this.upPercent);
});

module.exports = Monitor;
const Response = require('./response');
Monitor.hasMany(Response, 'responses', 'id', 'monitorID');