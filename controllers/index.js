module.exports.controller = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.route('/signin')
        .get(function (req, res) {
            return res.render('signin');
        })
        .post(function (req, res) {
            return res.send('not implemented yet');
        });

    app.get('/error', function (req, res) {
        res.render('error');
    })
};