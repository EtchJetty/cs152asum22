"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var reportSchema = Schema({
  shortdesc: String,
  longdesc: String
});

module.exports = mongoose.model("Report", reportSchema);
