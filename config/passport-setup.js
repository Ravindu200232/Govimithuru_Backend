const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "1062509031438-o4qdt0g9f8oehfeghqamk8ogd2begqj1.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
            }).save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));
