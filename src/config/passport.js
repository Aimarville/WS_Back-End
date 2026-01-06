const passport = require('passport');
const GBStrat = require('passport-github2').Strategy;
const GStrat = require('passport-google-oauth20').Strategy;
const config = require('./index.js')

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) =>{
    done(null, user);
});

passport.use(new GBStrat(
    {
        clientID: config.oauth.github.clientId,
        clientSecret: config.oauth.github.clientSecret,
        callbackURL: config.oauth.github.callbackUrl,
        scope: ['user:email'],
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));

passport.use(new GStrat(
    {
        clientID: config.oauth.google.clientId,
        clientSecret: config.oauth.google.clientSecret,
        callbackURL: config.oauth.google.callbackUrl,
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));

module.exports = passport;