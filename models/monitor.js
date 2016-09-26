const thinky = require('../lib/thinky');
const type = thinky.type;
// const safeName = require('../lib/safeName');

const badge = require('../lib/badge');

const Monitor = thinky.createModel('Monitor', {
    id: type.string(),
    name: type.string().required(),
    // safeName: type.string().required(),
    url: type.string().required(),
    userID: type.string().required()
});

// Monitor.pre('save', function (next) {
//     this.safeName = safeName(this.name);
//     next();
// });

Monitor.define('getUpPercent', function () {
    return 100;
});

Monitor.define('badge', function () {
    return badge.generate(this.name, this.getUpPercent())
});

module.exports = Monitor;
// const Cart = require('./cart');
// CartItem.belongsTo(Cart, 'cart', 'id', 'cartID');
