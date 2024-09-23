const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlerware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const User_safe_data = "firstName lastName age skills gender photoUrl about";

//Get all the pending connection requests
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", User_safe_data);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const connections = await ConnectionRequest.find({
    $or: [
      { toUserId: loggedInUser._id, status: "accepted" },
      { fromUserId: loggedInUser._id, status: "accepted" },
    ],
  })
    .populate("fromUserId", User_safe_data)
    .populate("toUserId", User_safe_data);

  const data = connections.map((row) => {
    if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });

  res.json({ data });
});

module.exports = userRouter;
