const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect, admin } = require("../middleware/auth.middleware");

router.post("/", protect, admin, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", protect, admin, categoryController.updateCategory);
router.delete("/:id", protect, admin, categoryController.deleteCategory);

module.exports = router;
