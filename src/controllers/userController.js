const { getRecentlyViewed, addRecentlyViewed } = require('../models/userModel');
const { getById } = require("../models/productModel");
const redisClient = require('../config/redisClient');

const getRecentlyViewedProducts = async (req, res) => {
  const userId = req.user.uid;

  try {
    let cache = [];

    cache = await redisClient.get(`recentlyViewed:${userId}`);
    // console.log(cache);
    
    if (cache) return res.status(200).send(JSON.parse(cache));

    res.status(200).send(cache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProductView = async (req, res) => {
  const userId = req.user.uid;
  const { productId } = req.body;
  try {
    await addRecentlyViewed(userId, productId);
    const products = await getRecentlyViewed(userId);

    let detailedProductsData = [];
    for (const product of products) {
      const productData = await getById(product.id);
      detailedProductsData.push({...product, name: productData.name })
    }
    // console.log(detailedProductsData);

    //caching top viewed product
    const productWithHighestViewCount = detailedProductsData.reduce((max, product) => 
      product.viewCount > max.viewCount ? product : max
    );
    const topViewedProduct = await getById(productWithHighestViewCount.id);
    await redisClient.set(`products:${topViewedProduct.id}`, JSON.stringify(topViewedProduct));

    await redisClient.set(`recentlyViewed:${userId}`, JSON.stringify(detailedProductsData));

    res.status(201).json({ message: 'Product added to recently viewed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getRecentlyViewedProducts, addProductView };
