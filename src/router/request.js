const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " making connection request!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = requestRouter;
