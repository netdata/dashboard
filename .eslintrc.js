module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  env: {
    browser: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  rules: {
    "no-underscore-dangle": ["error", { allow: ["__REDUX_DEVTOOLS_EXTENSION__"] }],
    "react/prop-types": [0],
    "react-hooks/rules-of-hooks": "error",
    "react/display-name": 0,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
        paths: ["src"],
      },
    },
  },
  overrides: [
    {
      files: ["*.test.*"],
      env: {
        jest: true,
      },
    },
  ],
}
