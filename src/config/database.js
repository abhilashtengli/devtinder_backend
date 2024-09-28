const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://tengliabhilash:w8mRUCXLm3E5aZ7m@learningnode.qiglb.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
