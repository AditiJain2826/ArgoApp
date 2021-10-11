const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/passport-setup");
const controller = require("./auth.controller");

router.get("/",  controller.home);
router.get("/pass", controller.pass);
router.get("/failed", controller.failed);
router.get("/logout", controller.logout);
router.get("/signon", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/failed" }), controller.callbackRedirect);

module.exports = router;
