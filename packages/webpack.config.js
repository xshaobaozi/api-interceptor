const path = require("path");

module.exports = {
  entry: {
    background: "./background/index.js",
    contents: "./contents/index.js",
  },
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../extensions/"),
  },
};
