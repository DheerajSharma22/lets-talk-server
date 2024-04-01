const { sendotp, signup, login, changePassword } = require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");
const { auth } = require("../middlewares/auth");

const authRoutes = require("express").Router();

authRoutes.post("/sendOtp", sendotp);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/change-password", auth, changePassword);
// Route for generating a reset password token
authRoutes.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
authRoutes.post("/reset-password", resetPassword)

module.exports = authRoutes;

