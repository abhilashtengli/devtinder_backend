const express = require("express");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", (req, res) => {
  res.send("Connection request sent!");
});

module.exports = requestRouter;
