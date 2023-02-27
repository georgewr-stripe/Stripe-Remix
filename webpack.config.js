const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.join(__dirname, "src/index.tsx"),
    background: path.join(__dirname, "src/background.js"),
  },
  output: { path: path.join(__dirname, "extension"), filename: "[name].js" },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(s*)css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",

          // "to-string-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "assets" },
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/rules.json", to: "rules.json" },
      ],
    }),
  ],
};
