const express = require("express");
const userAuth = require("../middleware/auth");
const connectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();

const DETAILS_ABOUT_CONNECTED = "firstName lastName age gender skill";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allRequest = await connectionRequest
      .find({
        status: "interested",
        toUserId: loggedInUser.id,
      })
      .populate("fromUserId", "firstName lastName age gender skill");
    console.log(allRequest);

    if (!allRequest) {
      return res.status(404).send("Request not found");
    }
    res.json({
      message: "all the request for " + loggedInUser.firstName,
      data: allRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectedUser = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", DETAILS_ABOUT_CONNECTED)
      .populate("toUserId", DETAILS_ABOUT_CONNECTED);

    const data = connectedUser.map((row) => {
      if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
        return row.fromUserId;
      }
      return row.toUserId;
    });

    res.json({ data });
  } catch (err) {
    return res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
