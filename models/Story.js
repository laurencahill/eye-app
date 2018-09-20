const mongoose   = require("mongoose");
const Schema     = mongoose.Schema;

const storySchema = new Schema({
  owner:{ type:Schema.Types.ObjectId, ref: "User" },
  question1: String,
  question2: String,
  question3: String,
  question4: String,
  question5: String,
  question6: String,
  question7: String,
  question8: String,
  question9: String,
  question10: String,
});

const Story = mongoose.model("stories", storySchema);

module.exports = Story;