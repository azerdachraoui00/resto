const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,
  toggle2FA,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { googleAuth,requestPasswordReset,resetPassword,setup2FA,verify2FA } = require("../controllers/authController");
const { verifyRole } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const router = express.Router();
const verificationCodes = {};// Store codes temporarily (Use DB for production)
// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-app-password", // Use an App Password instead of your real password
  },
});
// Generate random 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/toggle-2fa", toggle2FA);
router.post("/setup-2fa",protect, setup2FA);
router.post("/verify-2fa", protect,verify2FA);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUser);
router.delete("/profile", protect, deleteUser);
router.post("/google", googleAuth);
router.get("/admin-dashboard", protect, verifyRole(["admin", "superadmin"]), (req, res) => {
  res.json({ message: "Admin access granted!" });
});
// Only Superadmins can access
router.get("/superadmin-dashboard", protect, verifyRole(["superadmin"]), (req, res) => {
  res.json({ message: "Superadmin access granted!" });
});
router.post("/request-reset", requestPasswordReset);
router.post("/reset", resetPassword);


module.exports = router;
