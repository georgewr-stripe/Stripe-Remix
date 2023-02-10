const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.join(__dirname, "src/index.tsx"),
    background: path.join(__dirname, "src/background.js"),
    stripe: path.join(__dirname, "src/stripe.js"),
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
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
      ],
    }),
  ],
};
