const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
});

module.exports = mongoose.model("File", fileSchema);
