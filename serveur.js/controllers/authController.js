// controllers/authController.js
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendResetEmail } = require("../utils/mailer");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const verificationCodes = {}; // Store codes temporarily (use DB for production)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
// Step 1: Request Password Reset
requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    console.log("Generated Token:", token); // Debugging line
    console.log("User:", user); // Debugging line

    await user.save();
    await sendResetEmail(email, token);

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Step 2: Reset Password
const resetPassword = async (req, res) => {
  const { token, password  } = req.body; // Ensure newPassword is correctly received
  console.log("Request Body:", req.body);


  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    user.password = password; // ✅ Assign new password (Mongoose will hash it)
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save(); // 🔹 This triggers `pre("save")` and hashes the password

    res.json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//2FA
setup2FA = async (req, res) => {
  try {
    // Find the user using the ID from the JWT payload
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate the 2FA Secret
    const secret = speakeasy.generateSecret({
      name: `MealEase (${user.email})`, // Customize app name for better identification in the Authenticator app
    });

    // Save the 2FA secret to the user model
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate a 6-digit verification code
    const verificationCode = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    // Store the verification code temporarily
    verificationCodes[req.user.id] = verificationCode;

    // Generate a QR Code for Authenticator Apps
    QRCode.toDataURL(secret.otpauth_url, (err, qrCodeDataUrl) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(500).json({ message: "Error generating QR code" });
      }

      // Respond with the QR code URL and the secret
      res.json({ qrCodeDataUrl, secret: secret.base32, verificationCode });
    });
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    res.status(500).json({ message: error.message });
  }
};

//verify 2FA// Handle 2FA verification
verify2FA = async (req, res) => {
  try {
    console.log("User ID:", req.user ? req.user.id : "No user in token");
    const { verificationCode } = req.body;
    console.log("Verification Code Sent:", verificationCodes[req.user.id]);

    // Check if the verification code exists
    if (!verificationCode) {
      return res.status(400).json({ message: "Verification code is required." });
    }

    // Assuming you're sending a code to the user's email on setup
    const userCode = verificationCodes[req.user.id]; // User ID should be extracted from the auth middleware

    if (!userCode) {
      return res.status(400).json({ message: "No code found for the user." });
    }

    if (userCode === verificationCode) {
      // Successfully verified, now enable 2FA for the user
      // Perform the necessary actions to mark 2FA as enabled in your DB (e.g., setting a flag)

      // Optionally, delete the verification code after successful verification
      delete verificationCodes[req.user.id]; // Clean up the code

      return res.status(200).json({ message: "2FA successfully verified!" });
    } else {
      return res.status(400).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    console.error("Error during 2FA verification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = { googleAuth, requestPasswordReset, resetPassword ,setup2FA,verify2FA};

