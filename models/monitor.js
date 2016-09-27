const thinky = require('../lib/thinky');
const type = thinky.type;
const badge = require('../lib/badge');

const Monitor = thinky.createModel('Monitor', {
    id: type.string(),
    name: type.string().required(),
    url: type.string().required(),
    username: type.string().required()
});

Monitor.define('getUpPercent', function () {
    return 100;
});

Monitor.define('badge', function () {
    return badge.generate(this.name, this.getUpPercent())
});

module.exports = Monitor;
const Response = require('./response');
Monitor.hasMany(Response, 'responses', 'id', 'monitorID');