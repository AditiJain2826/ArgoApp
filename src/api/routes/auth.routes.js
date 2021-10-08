const express = require("express");

const router = express.Router();
const passport = require("passport");
require("../../config/passport-setup");

router.get(
  "/signon",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/pass");
  }
);

router.get("/pass", (req, res) => {
  res.send(`Welcome ${req.user.username}`);
});

router.get("/failed", (req, res) => {
  res.status(500).send("Failed to login");
});

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
