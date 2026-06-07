const express = require("express");
const userAuth = require("../middleware/auth");
const connectionRequest = require("../model/connectionRequest");
const user = require("../model/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skill photoUrl about";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allRequest = await connectionRequest
      .find({
        status: "interested",
        toUserId: loggedInUser.id,
      })
      .populate("fromUserId", USER_SAFE_DATA);

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
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const getAllConnected = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hideAllConnected = new Set();
    getAllConnected.forEach((req) => {
      hideAllConnected.add(req.fromUserId);
      hideAllConnected.add(req.toUserId);
    });

    const feedData = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideAllConnected) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      message: "all the feed data",
      data: feedData,
    });
  } catch (err) {
    return res.status(400).json({
      message: "ERROR : " + err.message,
    });
  }
});

module.exports = userRouter;
