var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports.controller = function (app) {

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({ usernameField: 'emailInput', passwordField: 'passwordInput' },
        function (email, password, done) {
            User.findOne({email: email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                else if (!user) {
                    return done(null, false, {message: 'User not found'});
                }
                user.comparePassword(password, function (err, match) {
                    if (err) {
                        return done(null, false, {message: 'Bad login'});
                    }
                    if (match) {
                        //ITS GOOD!
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'could not match.'});
                    }
                });
            });
        }
    ));

    app.route('/signup')
        .get(isAuthenticated, function (req, res) {
            return res.render('auth/signup')
        })
        .post(isAuthenticated, function (req, res) {
            var email = req.body.emailInput;
            var password = req.body.passwordInput;
            var passwordConfirm = req.body.confirmPasswordInput;
            if (email && password && passwordConfirm) {
                if (password == passwordConfirm) {
                    User.find({email: email}).exec(function (err, existingUser) {
                        if (err) {
                            return res.send(err);
                        }
                        if (existingUser && existingUser.length > 0) {
                            return res.send('user exists with that email address');
                        }
                        var user = new User({
                            email: email,
                            password: password
                        });
                        user.save(function (err) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.redirect('/');
                            }
                        });
                    });
                } else {
                    return res.send('password != passwordConfirm');
                }
            } else {
                return res.send('all fields required');
            }
        });

    app.route('/signin')
        .get(isAuthenticated, function (req, res) {
            return res.render('auth/signin');
        })
        .post(isAuthenticated, function (req, res, next) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
//                    Util.flashError(req, info.message);
                    return res.redirect('/signin');
                }
                req.logIn(user, function (err) {
                    if (err) {
//                        Util.flashError(req, info.message);
                        return next(err);
                    }
                    return res.redirect('/');
                });
            })(req, res, next);
        });

    app.get('/signout', function (req, res) {
        req.logout();
        return res.redirect('/');
    });
    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        }
        return next();
    }
};
