const mongoose   = require("mongoose");
const Schema     = mongoose.Schema;

const storySchema = new Schema({
  questionOne: String,
  questionTwo: String,
  questionThree: String,
  questionFour: String,
  questionFive: String,
  questionSix: String,
  questionSeven: String,
  questionEight: String,
  questionNine: String,
  questionTen: String,
});

const Story = mongoose.model("stories", storySchema);

module.exports = Story;