const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
  status: {
    type: Number,
    required: [true, "Please add a status"],
    enum: [1, 2], //1 - active, 2 - inactive
    default: 1,
  },
  role: {
    type: Number,
    required: [true, "Please add a role"],
    enum: [1, 2], //1 - admin, 2 - user
    default: 2,
  },
});

module.exports = mongoose.model("User", userSchema);
