var mongoose = require('mongoose');

var responseSchema = mongoose.Schema({
    monitor: {type: String, required: true},
    code: {type: Number, required: true},
    time: {type: Number, required: true},
    created_at: Date

});

responseSchema.pre('save', function (next) {
    this.created_at = new Date();
    next();
});

var Response = mongoose.model('Response', responseSchema);

module.exports = Response;

