const express = require('express');
const router = express.Router();
const pricingAdjustmentController = require('./controller');

router.post('/', pricingAdjustmentController.create)
router.get('/based-on-price', pricingAdjustmentController.getBasedOnPrice)
// router.get('/price-table', pricingAdjustmentController.getPriceTable)
router.delete('/:id', pricingAdjustmentController.deleteAdjustment)
router.get('/', pricingAdjustmentController.getAllPriceAdjustment)

module.exports = router;
