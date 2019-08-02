const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/task-manager-app", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: true
});

module.exports = mongoose;
