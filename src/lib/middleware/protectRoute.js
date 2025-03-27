import User from "../../models/user.models.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from the Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Find the user in the database
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token signature" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
