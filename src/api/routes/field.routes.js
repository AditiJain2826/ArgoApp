const express = require("express");
const controller = require('../controllers/field.controller');

const router = express.Router();

router.route("/").get(controller.list);
router.route("/:id").get(controller.getById);
router.route("/").post(controller.create);
router.route("/:id").patch(controller.update);
router.route("/:id").delete(controller.delete);

module.exports = router;
