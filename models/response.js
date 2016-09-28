const thinky = require('../lib/thinky');
const type = thinky.type;
const r = thinky.r;

const Response = thinky.createModel('Response', {
    id: type.string(),
    date: type.date().default(r.now()),
    time: type.number().required(), //Milliseconds, ms
    monitorID: type.string().required(),
    statusCode: type.number().required(),
    up: type.boolean().required(),
    error: type.string()
});

module.exports = Response;
const Monitor = require('./monitor');
Response.belongsTo(Monitor, 'monitor', 'id', 'monitorID');
