const express = require('express');
const { getRecentlyViewedProducts, addProductView } = require('../controllers/userController');
const { getAllProducts, getProductById } = require('../controllers/productController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users/:userId/recentlyViewed', authenticateUser, getRecentlyViewedProducts);
router.post('/users/:userId/recentlyViewed', authenticateUser, addProductView);

router.get('/products', authenticateUser, getAllProducts);
router.get('/products/:productId', getProductById);

module.exports = router;
