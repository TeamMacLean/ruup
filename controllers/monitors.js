module.exports.controller = function (app) {
    app.get('/monitors', function (req, res) {
        res.render('monitors/index');
    });
};