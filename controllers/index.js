module.exports.controller = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.route('/signin')
        .get(function (req, res) {
        res.render('signin');
        })
        .post(function (req, res) {
        });
};