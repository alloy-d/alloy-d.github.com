var path = require("path");
var webpack = require("webpack");

var config = {
  entry: [
    "wires.js"
  ],
  output: {
    path: __dirname + "/public/assets",
    publicPath: "/assets/",
    filename: "bundle.js",
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ },
      { test: /\.json$/, loaders: ['json']},
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    root: ["js", "node_modules"],
    extensions: ["", ".js", ".jsx", ".json"],
    alias: {
      "c": "components",
      "m": "mixins",
      "r": "resources",

      "bacon$": "baconjs",
      "react$": "react/addons",
    },
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules"),
  },
};

function addSass(config) {
  config.module.loaders.push({
    test: /\.scss$/,
    loaders: ["style", "css", "sass?outputStyle=expanded"],
  });

  config.resolve.root.push("./_sass");
  config.resolve.extensions.push(".scss");

  config.entry.push("./_sass/base.scss");
}

function addFonts(config) {
  config.resolve.root.push("./fonts");
  config.module.loaders = config.module.loaders.concat([
    { test: /\.woff2?(\?.*)?$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
    { test: /\.ttf(\?.*)?$/,    loader: "file-loader" },
    { test: /\.eot(\?.*)?$/,    loader: "file-loader" },
    { test: /\.svg(\?.*)?$/,    loader: "file-loader" },
  ]);
}

addSass(config);
addFonts(config);

module.exports = config;
