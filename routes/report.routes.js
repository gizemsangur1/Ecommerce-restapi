const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const reportController = require("../controllers/report.controller");

router.get("/", protect, admin, reportController.getOrdersReport);

module.exports = router;
