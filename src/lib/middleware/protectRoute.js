import User from "../../models/user.models.js"; 
import jwt from "jsonwebtoken"; 
const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from cookies
    const token = req.header("Authorization").replace("Bearer ", "")

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is invalid
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Find the user in the database by ID (excluding the password field)
    const user = await User.findById(decodedToken.userId).select("-password");

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default protectRoute