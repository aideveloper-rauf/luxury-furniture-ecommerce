const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Admin only middleware
const adminMiddleware = async (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
  next();
};

// Delivery person middleware
const deliveryMiddleware = async (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'delivery') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Delivery personnel only.' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, deliveryMiddleware };
