const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ["superadmin", "admin", "user"],
    default: "user",
  }, // Default role is "user"

  // 🔹 Password Reset Fields
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  // 🔹 2FA Fields
  twoFactorEnabled: { type: Boolean, default: false }, // 🔹 2FA toggle
  twoFactorSecret: String, // 🔹 Secret for Google Authenticator (optional)
});

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare passwords (for login)
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
