const { db } = require('../config/firebase');

const getRecentlyViewed = async (userId) => {
	try {
		const snapshot = await db
		.collection(`users/${userId}/recentlyViewed`)
		.orderBy('timestamp', 'desc')
		.orderBy('viewCount', 'desc')
		.get();
		return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
	} catch (error) {
		throw error;
	}
};

const addRecentlyViewed = async (userId, productId) => {
	try {
		let viewCount = 0;
		const recentlyViewedRef = db.collection(`users/${userId}/recentlyViewed`);
		// console.log({userId}, {productId});
		
		const recentlyViewedDoc = await recentlyViewedRef.doc(productId).get();
		if (recentlyViewedDoc.exists) {
			// console.log(recentlyViewedDoc.data());
			viewCount = recentlyViewedDoc.data().viewCount;
		}
		// Add a new product to the subcollection
		await recentlyViewedRef.doc(productId).set({
			viewCount: viewCount + 1,
			timestamp: Date.now(),
		});
		
		// Optional: Limit to 10 entries in Firestore
		const snapshot = await recentlyViewedRef.orderBy('timestamp', 'desc').orderBy('viewCount', 'desc').get();
		// console.log(snapshot.size);
		if (snapshot.size > 5) {
			const extraDocs = snapshot.docs.slice(5);
			extraDocs.forEach(async (doc) => {
				await doc.ref.delete();
			});
		}
	} catch (error) {
		throw error;
	}
};

module.exports = { getRecentlyViewed, addRecentlyViewed };
