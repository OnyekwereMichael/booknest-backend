import User from "../../models/user.models.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from the Authorization header
    const token = req.header("Authorization");
    console.log("Received token:", token);

    if (!token || !token.startsWith("Bearer ")) {
      console.log("No token found or invalid format");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Extract token without "Bearer "
    const extractedToken = token.replace("Bearer ", "");
    console.log("Extracted Token:", extractedToken);

    // Verify the token using the secret key
    let decodedToken;
    try {
      decodedToken = jwt.verify(extractedToken, process.env.JWT_SECRET);
      console.log("Decoded Token:", decodedToken);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired, please log in again" });
      }
      console.error("Error verifying token:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Ensure the token was correctly decoded
    if (!decodedToken || !decodedToken.userId) {
      console.log("Invalid token, no userId present");
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Find the user in the database
    const user = await User.findById(decodedToken.userId).select("-password");
    
    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    console.log("Authenticated User:", user);

    // Attach the user object to the request
    req.user = user;
    console.log("User attached to req.user:", req.user);

    next();
  } catch (error) {
    console.log("Middleware Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
