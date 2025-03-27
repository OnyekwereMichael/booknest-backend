import jwt from "jsonwebtoken";
import User from "../../models/user.models.js";

const protectRoute = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Find the user by ID
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach the user to the request
    req.user = user;
    next();
  } catch (error) {
    console.error('Middleware error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default protectRoute;
