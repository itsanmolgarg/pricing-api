const express = require('express');
const router = express.Router();
const pricingProfileController = require('./controller')

router.post('/', pricingProfileController.create)
router.get('/', pricingProfileController.getAll)
router.get('/:id', pricingProfileController.getById)
router.delete('/:id', pricingProfileController.deleteById)
router.put('/:id', pricingProfileController.update)

module.exports = router;
