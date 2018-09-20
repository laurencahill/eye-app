const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  parentName: String,
  emailAddress: String,
  parentReason: String,
  parentImage: String,
  childName: String,
  childImage: String,
  childAge: Number,
  childCondition: String,
  childEye: String,
  familyLocation: String,
  story: String,
  role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
  acceptUser: {
      type: Boolean,
      default: true,
    },
  hasStory: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);

module.exports = User;