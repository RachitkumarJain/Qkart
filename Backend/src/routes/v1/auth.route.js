const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();



router.use("/register", validate(authValidation.register), authController.register);
router.use("/login", validate(authValidation.login), authController.login);


module.exports = router;
