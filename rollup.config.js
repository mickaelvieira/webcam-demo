import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

const isProd = process.env.NODE_ENV === "production"
const format = "iife";

const plugins = [
  babel({
    babelrc: false,
    extensions: ["js", "ts"],
    exclude: [
      "node_modules/**"
    ],
    plugins: [
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
      ["@babel/plugin-transform-regenerator"],
    ],
    presets: [
      ["@babel/preset-env", {
        corejs: 3,
        modules: false,
        useBuiltIns: "usage",
      }],
      ["@babel/preset-typescript"]
    ],
  }),
  resolve(),
  commonjs({
    extensions: [".ts", ".js"]
  })
];

if (isProd) {
  plugins.push(uglify())
}

export default [{
  input: "src/app.ts",
  output: {
    name: "app",
    dir: "./public",
    entryFileNames: "[name].js",
    format
  },
  plugins
}];