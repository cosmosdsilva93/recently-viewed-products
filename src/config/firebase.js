const admin = require('firebase-admin');
const serviceAccount = require('../utils/recently-viewed-products-sa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://recently-viewed-products-a170b.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth};
