"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var reportSchema = Schema({
  name: String,
  email: String,
  phone: String,
  comments: String,
  userId: {type: ObjectId, index: true},
});

module.exports = mongoose.model("Report", reportSchema);
