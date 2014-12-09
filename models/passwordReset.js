var mongoose = require('mongoose');

var passwordResetSchema = mongoose.Schema({
    user: {type: String, required: true},
    uid: String,
    used: {type: Boolean, default: false},
    createdAt: Number
});

passwordResetSchema.pre('save', function (next) {
    var reset = this;
    reset.uid = guid();
    reset.createdAt = Date.now();
    console.log(reset);

    next();
});

var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return function () {
        return s4() + s4() + '' + s4() + '' + s4() + '' +
            s4() + '' + s4() + s4() + s4();
    };
})();

var passwordReset = mongoose.model('passwordReset', passwordResetSchema);

module.exports = passwordReset;