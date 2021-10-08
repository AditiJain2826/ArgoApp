const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../api/models/index");
const User = require("../api/models/index").User;
const jwt = require("jsonwebtoken");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (userData, done) {
  db.User.findAll({ where: { googleId: userData.id } }, function (err, user) {
    done(err, user);
  });
  done(null, userData);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      db.User.findOne({
        where: {
          email: profile.emails[0].value,
        },
      }).then((user) => {
        if (user) {
          db.User.update(
            {
              id: profile.id,
              googleId: profile.id,
              email: profile.emails[0].value,
              username: profile.displayName,
            },
            {
              where: {
                email: profile.emails[0].value,
              },
            }
          )
            .then((user) => {
              return db.User.findOne({
                where: { email: profile.emails[0].value },
              });
            })
            .then((user) => {
              return done(null, user);
            })
            .catch((error) => {
              return done(error, null);
            });
        } else if (!user) {
          db.User.create({
            id: profile.id,
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
          })

            .then((user) => {
              return db.User.findOne({
                where: { email: profile.emails[0].value },
              });
            })
            .then((user) => {
              return done(null, user);
            })
            .catch((error) => {
              return done(error, null);
            });
        }
      });
    }
  )
);
