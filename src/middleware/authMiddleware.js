const { auth } = require('../config/firebase');

// Middleware to authenticate user using Firebase ID Token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Bearer token is missing or invalid.' });
  }

  const idToken = authHeader.split(' ')[1]; // Extract the token

  try {
    // Verify the token with Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);

    // Attach user info to request object
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized. Bearer token is missing or invalid.' });
  }
};

module.exports = { authenticateUser} ;
  