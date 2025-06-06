const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect, admin } = require("../middleware/auth.middleware");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;
