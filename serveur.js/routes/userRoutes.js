const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUser);
router.delete("/profile", protect, deleteUser);

module.exports = router;
