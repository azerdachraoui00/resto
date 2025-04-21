const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  console.log(req.header("Authorization"))
  const token = req.header("Authorization")?.split(" ")[1]; 
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded User:", req.user); 
    next();
  } catch (error) {
    console.error("Token Error:", error); 
    res.status(401).json({ message: "Invalid Token" });
  }
};

exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

