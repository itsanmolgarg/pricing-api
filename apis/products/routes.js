const express = require('express');
const router = express.Router();
const productController = require('./controller')

router.post('/', productController.create);
router.get('/search', productController.search);

module.exports = router;
