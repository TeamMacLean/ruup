var mongoose = require('mongoose');

var responseSchema = mongoose.Schema({
    monitor: {type: String, required: true},
    code: {type: String, required: true},
    time: {type: Number, required: true},
    createdAt: Date

});

responseSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    next();
});

var Response = mongoose.model('Response', responseSchema);

module.exports = Response;

