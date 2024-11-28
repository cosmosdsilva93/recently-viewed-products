const express = require('express');

const { renderProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/products/:productId', renderProduct);

module.exports = router;
