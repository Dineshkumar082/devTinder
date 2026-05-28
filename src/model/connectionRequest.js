const mongoose = require("mongoose");
const { Schema } = mongoose;
const connectionRequestSchema = new Schema(
  {
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{value} not supported`,
      },
    },
  },
  { timestamp: true },
);

connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });
const connectionRequestmodel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);
module.exports = connectionRequestmodel;
