var User = require('../models/user');
var passport = require('passport');
var util = require('../lib/util');
var emailer = require('../models/email');
var LocalStrategy = require('passport-local').Strategy;
var passwordReset = require('../models/passwordReset');

var passwordResetValidLength = 86400000;

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
        .get(isUnauthenticated, function (req, res) {
            return res.render('auth/signup');
        })
        .post(isUnauthenticated, function (req, res) {
            var email = req.body.emailInput;
            var password = req.body.passwordInput;
            var passwordConfirm = req.body.confirmPasswordInput;
            if (email && password && passwordConfirm) {
                if (password == passwordConfirm) {
                    User.find({email: email}).exec(function (err, existingUser) {
                        if (err) {
                            return util.renderError(err, res);
                        }
                        if (existingUser && existingUser.length > 0) {
                            return util.renderError('user exists with that email address', res);
                        }
                        var user = new User({
                            email: email,
                            password: password
                        });
                        user.save(function (err) {
                            if (err) {
                                return util.renderError(err, res);
                            } else {
                                emailer.newUser(email);
                                res.redirect('/');
                            }
                        });
                    });
                } else {
                    return util.renderError('password != passwordConfirm', res);
                }
            } else {
                return util.renderError('all fields required', res);
            }
        });

    app.route('/signin')
        .get(isUnauthenticated, function (req, res) {
            return res.render('auth/signin');
        })
        .post(isUnauthenticated, function (req, res, next) {
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


    app.get('/account', isAuthenticated, function (req, res) {
        res.render('auth/account');
    });

    app.route('/account/reset')
        .get(isAuthenticated, function (req, res) {
            res.render('auth/newPassword');
        })
        .post(isAuthenticated, function (req, res) {
            var newPassword = req.body.newPasswordInput;
            var confirmNewPassword = req.body.confirmNewPasswordInput;
            if (newPassword && confirmNewPassword) {
                if (newPassword == confirmNewPassword) {
                    User.findOne({_id: req.user._id}, function (err, user) {
                        if (err) {
                            return util.renderError(err, res);
                        }
                        if (!user) {
                            return util.renderError('user not found', res);
                        }
                        user.password = newPassword;
                        user.save(function (err) {
                            if (err) {
                                return util.renderError(err, res);
                            }
                            req.logout();
                            res.redirect('/signin');
                        });
                    });
                } else {
                    return util.renderError('passwords do not match', res);
                }
            } else {
                return util.renderError('please enter new password twice', res);
            }

//            sign them out
        });

    app.route('/account/lost')
        .get(isUnauthenticated, function (req, res) {
            res.render('auth/lost');
        })
        .post(isUnauthenticated, function (req, res) {
            var emailInput = req.body.emailInput;
            if (emailInput) {
                User.findOne({email: emailInput}, function (err, user) {
                    if (!user) {
                        return util.renderError('no users found with the email address: ' + emailInput, res);
                    }
                    if (err) {
                        return util.renderError(err, res);
                    }
                    var reset = new passwordReset({
                        user: user._id
                    });
                    reset.save(function (err, out) {
                        if (err) {
                            return util.renderError(err, res);
                        } else {
                            var resultURL = req.protocol + '://' + req.get('host') + '/account/lost/' + out.uid;
                            emailer.resetPassword(user.email, resultURL);
                            return res.redirect('/');
                        }
                    });
                });
            } else {
                return util.renderError('no email address entered', res);
            }
        });

    app.route('/account/lost/:uid')
        .get(isUnauthenticated, function (req, res) {
            var resetID = req.param('uid');
            passwordReset.findOne({uid: resetID}, function (err, resetRequest) {
                if (err) {
                    return util.renderError(err, res);
                }
                if (!resetRequest) {
                    return util.renderError('reset request not found', res);
                }
                var dateNow = Date.now();
                console.log(dateNow);
                if (resetRequest.createdAt + passwordResetValidLength > dateNow) {
                    User.findOne({_id: resetRequest.user}, function (err, user) {
                        if (err) {
                            return util.renderError(err, res);
                        }
                        if (!user) {
                            return util.renderError('user not found', res);
                        }
                        res.render('auth/lostNewPassword', {uid: resetID, email: user.email});
                    });
                } else {
                    return util.renderError('this link has expired.', res);
                }
            })
        })
        .post(isUnauthenticated, function (req, res) {
            var newPassword = req.body.newPasswordInput;
            var confirmNewPassword = req.body.confirmNewPasswordInput;
            var resetID = req.param('uid');
            if (newPassword && confirmNewPassword) {
                if (newPassword == confirmNewPassword) {
                    passwordReset.findOne({uid: resetID}, function (err, reset) {
                        if (err) {
                            return util.renderError(err, res);
                        }
                        if (!reset) {
                            return util.renderError('reset request not found', res);
                        }
                        reset.used = true;
                        reset.save(function (err) {
                            if (err) {
                                return util.renderError(err, res);
                            }
                            User.findOne({_id: reset.user}, function (err, user) {
                                if (err) {
                                    return util.renderError(err, res);
                                }
                                if (!reset) {
                                    return util.renderError('user not found', res);
                                }
                                user.password = newPassword;
                                user.save(function (err, out) {
                                    if (err) {
                                        return util.renderError(err, res);
                                    }
                                    res.redirect('/signin');
                                });
                            })
                        });
                    });
                } else {
                    return util.renderError('passwords do not match', res);
                }
            } else {
                return util.renderError('please enter new password twice', res);
            }
        });


//    if not authenticated make them signin
    function isUnauthenticated(req, res, next) {
        if (req.isUnauthenticated()) {
            return next();
        }
        return res.redirect('/');
    }

//    is already authenticated send them home
    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signup');
    }
};

