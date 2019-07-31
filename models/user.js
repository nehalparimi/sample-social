let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
const SALT_FACTOR = 10;

let userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    displayName: String,
    bio: String
});

userSchema.methods.name = function() {
    return this.displayName || this.username;
};

let noop = function() {};

// Pre-save, hash the password
userSchema.pre('save', function(done) {
    let user = this;
    if (!user.isModified('password')) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
            if (err) return done(err);
            user.password = hashedPassword;
            done();
        });
    });
});

// Check the password
userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

let User = mongoose.model("User", userSchema);
module.exports = User;

