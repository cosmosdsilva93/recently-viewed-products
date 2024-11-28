const { getAll, getById } = require('../models/productModel');
const redisClient = require('../config/redisClient');

const getAllProducts = async (req, res) => {
  let response = [];
  try {
    const products = await getAll();

    if (products.length) {
        response = products;
    }

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
    console.log('here2');
  const { productId } = req.params;
  try {
    const cache = await redisClient.get(`products:${productId}`);
    if (cache) return res.status(200).send(JSON.parse(cache));

    const productData = await getById(productId);
    await redisClient.set(`products:${productId}`, JSON.stringify(productData));
    
    
    res.status(201).json(productData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const renderProduct = async (req, res) => {

    const { productId } = req.params;
    try {
      const cache = await redisClient.get(`products:${productId}`);
      
      if (cache) return res.render('product', JSON.parse(cache));
  
      const productData = await getById(productId);
      await redisClient.set(`products:${productId}`, JSON.stringify(productData));
      
    //   console.log(productData);
      
      res.render('product', productData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = { getAllProducts, getProductById, renderProduct };
