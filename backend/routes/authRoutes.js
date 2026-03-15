const router = require("express").Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/authController");

// User registration
router.post("/register", register);

// User login
router.post("/login", login);

// Resend verification email (if user didn't receive the first one)
router.post("/resend-verification", resendVerification);

// Email verification
router.get("/verify/:token", verifyEmail);

// Forgot password
router.post("/forgot-password", forgotPasswordController);

// Reset password
router.post("/reset-password/:token", resetPasswordController);

module.exports = router;