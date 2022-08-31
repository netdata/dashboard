module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:jest-dom/recommended"],
  overrides: [
    {
      files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react", "plugin:jest-dom/recommended"],
    },
    {
      files: ["*.ts", "*.tsx"],
      globals: {
        JSX: true,
      },
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "testing-library", "jest-dom"],
  rules: {
    "react/prop-types": [0],
    "react-hooks/rules-of-hooks": "error",
    "react/display-name": 0,
  }
}
