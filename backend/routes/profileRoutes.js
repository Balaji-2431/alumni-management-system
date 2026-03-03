const express = require("express");
const { getMyProfile, updateMyProfile, removeProfilePic, changePassword } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();

router.get("/", protect, getMyProfile);
router.put("/", protect,upload.uploadProfilePic.single("profilePic"), updateMyProfile);
router.delete("/remove-pic", protect, removeProfilePic);
router.put("/change-password", protect, changePassword);

module.exports = router;
