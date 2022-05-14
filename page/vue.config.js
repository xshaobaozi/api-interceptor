const path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "../panel" : "/",
  outputDir: path.resolve(__dirname, "./../extensions/panel"),
};
