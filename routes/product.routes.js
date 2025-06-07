const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", protect, admin, productController.createProduct);
router.get("/", productController.getFilteredProducts); 
router.get("/bestsellers", productController.getBestSellers);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);
router.put("/:id/images", protect, admin, upload.array("images", 5), productController.uploadProductImages);
router.get("/category/:categoryId", productController.getProductsByCategory);


module.exports = router;
