const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  try {
    //  Check for Authorization header and token format
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
    } else {
      return res.status(401).json({ message: "❌ No token provided, authorization denied" });
    }

    if (!token) {
      return res.status(401).json({ message: "❌ No token, authorization denied" });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //  Fetch user from DB and exclude password
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "❌ Unauthorized, user not found" });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("❌ JWT Error:", error.message);

    //  Handle specific token errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "❌ Token expired, please log in again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "❌ Invalid token, authorization denied" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ message: "❌ Token not active, please try again later" });
    }

    return res.status(500).json({ message: "❌ Server error, failed to authenticate" });
  }
};

module.exports = protect;
