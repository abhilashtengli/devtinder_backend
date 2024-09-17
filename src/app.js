const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Server");
});

app.get("/helloo", (req, res) => {
  res.send("Hello is successful");
});
app.get("/test", (req, res) => {
  res.send("Test is successful");
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
