const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/user.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/"  , controller.index);
router.post("/register" , controller.register);
router.post("/login" , controller.login);
router.post ("/password/forgot" , controller.forgotPassword);
router.post("/password/otp" , controller.otpPassword);
router.post ("/password/reset" , controller.resetPassword);
router.get("/profile" , controller.profile);

module.exports = router;