const User = require("../models/User");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Ensure only superadmins can create admin or superadmin users
    if (role && ["admin", "superadmin"].includes(role) && req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmins can assign admin roles." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || "user", // Default role is "user"
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password, token } = req.body; // Token for 2FA
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 If 2FA is enabled, require the TOTP code
    if (user.twoFactorEnabled) {
      if (!token) {
        return res.status(403).json({ message: "2FA code required" });
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
      });

      if (!isValid) {
        return res.status(400).json({ message: "Invalid 2FA code" });
      }
    }

    // 🔹 Generate token after successful login
    res.status(200).json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User (Protected)
exports.updateUser = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérification si une image est envoyée
    if (profilePic) {
      // Vérifier si c'est bien du Base64
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(profilePic)) {
        return res.status(400).json({ message: "Format d'image non valide !" });
      }

      // Limiter la taille du fichier (ex: max 500 KB)
      const base64Data = profilePic.split(",")[1]; // Enlever le préfixe `data:image/...`
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length > 500 * 1024) {
        return res.status(400).json({ message: "L'image est trop grande (max 500KB) !" });
      }

      user.profilePic = profilePic; // Stockage en base de données
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete User (Protected)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Toggle 2FA
exports.toggle2FA = async (req, res) => {
  try {
    const { userId, enabled } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: enabled },
      { new: true }
    );

    res.status(200).json({
      message: `2FA ${enabled ? "enabled" : "disabled"} successfully`,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update 2FA settings" });
  }
};
