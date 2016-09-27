const thinky = require('../lib/thinky');
const type = thinky.type;
const badge = require('../lib/badge');

const Monitor = thinky.createModel('Monitor', {
    id: type.string(),
    name: type.string().required(),
    url: type.string().required(),
    username: type.string().required(),
    upPercent: type.number().default(100)
});

Monitor.define('getBadge', function () {
    return badge.generate(this.name, this.upPercent)
});

module.exports = Monitor;
const Response = require('./response');
Monitor.hasMany(Response, 'responses', 'id', 'monitorID');