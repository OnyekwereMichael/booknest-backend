import User from "../../models/user.models.js"; 
import jwt from "jsonwebtoken"; 

const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from the Authorization header
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Extract token without "Bearer "
    const extractedToken = token.replace("Bearer ", "");

    // Verify the token using the secret key
    const decodedToken = jwt.verify(extractedToken, process.env.JWT_SECRET);

    // Ensure the token was correctly decoded
    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Find the user in the database
    const user = await User.findById(decodedToken.userId).select("-password");

    // Ensure the user exists
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Attach the user object to the request
    req.user = user;

    console.log("Authenticated User:", user); // Debug log

    next();
  } catch (error) {
    console.log("Middleware Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
