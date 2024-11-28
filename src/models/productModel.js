const { db } = require('../config/firebase');

const getAll = async () => {
	try {
		const snapshot = await db
		.collection(`products`)
		.get();
		return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
	} catch (error) {
		throw error;
	}
};

const getById = async (productId) => {
	try {
        let productData = {};
		const productDoc = await db.collection(`products`).doc(productId).get();
		if (productDoc.exists) {
			// console.log(recentlyViewedDoc.data());
			productData =  {id: productDoc.id, ...productDoc.data()}
		}
        return productData;
	} catch (error) {
		throw error;
	}
};

module.exports = { getAll, getById };
