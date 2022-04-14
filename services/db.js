// to give mongo db connection details

// mongoose impport

const mongoose = require("mongoose");

// state connection string

mongoose.connect("mongodb://localhost:27017/bankApplication", {
  useNewUrlParser: true,
});

// model creation

const User = mongoose.model("User", {
  acno: Number,
  uname: String,
  password: String,
  balance: Number,
  transaction: [],
});

// export model-User

module.exports = {
  User,
};
