// routes.js

const express = require("express");
const pricingAdjustmentRoutes = require("./apis/pricingAdjustment/routes");
const pricingProfileRoutes = require("./apis/pricingProfile/routes");
const productRoutes = require("./apis/products/routes");
const router = express.Router();

router.use("/api/pricing-adjustment", pricingAdjustmentRoutes);
router.use("/api/pricing-profile", pricingProfileRoutes);
router.use("/api/products", productRoutes);

module.exports = router;
