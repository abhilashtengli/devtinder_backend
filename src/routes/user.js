const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlerware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    if (row.fromUserId._id.equals(loggedInUser._id)) {
      return row.toUserId;
    }
    return row.fromUserId;
  });

  res.json({ data });
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUserFromFeed = new Set();
    connections.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(User_safe_data)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
