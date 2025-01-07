const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.mongoURL);
};

module.exports = connectDb;
