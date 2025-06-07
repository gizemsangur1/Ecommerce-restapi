const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 

const userController = require("../controllers/user.controller");

router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);
router.put("/profile/password", protect, userController.changePassword);
router.put("/profile/photo", protect, upload.single("profilePicture"), userController.updateProfilePicture);
router.delete("/profile", protect, userController.deleteUserAccount);

module.exports = router;
