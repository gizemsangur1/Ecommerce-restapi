const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");


router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);
router.get("/", productController.getFilteredProducts);
router.put("/:id/images", upload.array("images", 5), productController.uploadProductImages);

module.exports = router;
