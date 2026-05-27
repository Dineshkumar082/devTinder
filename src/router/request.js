const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const connectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("this status not allowed!");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("user not found");
      }

      if (fromUserId.equals(toUserId)) {
        return res.status(400).send("Invalid request!");
      }

      const isRequestBefore = connectionRequest.findOne({
        $or: [
          {
            toUserId,
            fromUserId,
          },
          {
            toUserId: fromUserId,
            fromUserId: toUser,
          },
        ],
      });

      if (isRequestBefore) {
        return res.status(400).send("Don't make request again");
      }

      const request = new connectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      await request.save();
      res.send("connection request send saved successfully!");
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);

module.exports = requestRouter;
