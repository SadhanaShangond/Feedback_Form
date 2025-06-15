const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  //get the token

  const token = req?.cookies?.token;
  if (!token) {
    return res.status(400).json({ message: "please login" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_MESSAGE);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).send("something went wrong");
  }
}
module.exports = verifyToken;
