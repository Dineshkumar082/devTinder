const User = require("../model/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token expired, need to login again buddy!");
    }
    const userId = jwt.verify(token, "CloseAndOpen@123");
    const user = await User.findOne({ _id: userId._id });
    if (!user) {
      throw new Error("Token expired, need to login again");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
};
module.exports = userAuth;
