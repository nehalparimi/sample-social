let express = require('express');
let passport = require('passport');

let User = require('./models/user');

let router = express.Router();

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

router.get('/', function(req, res, next) {
    User.find()
    .sort({ createdAt: "descending" })
    .exec(function(err, users) {
        if (err) return next(err);
        res.render('index', { users: users });
    });
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ username }, function(err, user) {
        if (err) return next(err);
        // If user with the same username is found
        // implying the user exists
        if (user) {
            req.flash('error', 'User already exists');
            res.redirect('/signup');
        }

        let newUser = new User({
            username,
            password
        });
        newUser.save(next);
    });
}, passport.authenticate("login", {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));
module.exports = router;