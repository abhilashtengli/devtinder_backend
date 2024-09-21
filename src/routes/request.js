const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlerware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        throw new Error("You cannot send request to yourself");
      }

      const isUserExist = await User.findById(toUserId);
      console.log(isUserExist);
      if (!isUserExist) {
        throw new Error(
          "The User does not exist whom you are trying to send request "
        );
      }

      const allowedStatus = ["interested", "ignore"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type : " + status,
        });
      }

      const exisitingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (exisitingConnectionRequest) {
        throw new Error("Connection request already exist");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
