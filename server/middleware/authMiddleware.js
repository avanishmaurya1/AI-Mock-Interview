 const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

  try {

    let token = req.headers.authorization;


    // Check token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, access denied",
      });
    }


    // Check Bearer format
    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }


    // Remove Bearer
    token = token.split(" ")[1];


    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Attach user data
    req.user = decoded;


    next();


  } catch (error) {

    console.error(
      "Auth Error:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

};


module.exports = protect;