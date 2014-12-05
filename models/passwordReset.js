var mongoose = require('mongoose');

var passwordResetSchema = mongoose.Schema({
    user: {type: String, required: true},
    used: {type: Boolean, default: false}
});

var passwordReset = mongoose.model('passwordReset', passwordResetSchema);

module.exports = passwordReset;