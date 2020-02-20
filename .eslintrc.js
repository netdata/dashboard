module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react-hooks",
  ],
  "env": {
    "browser": true,
  },
  "extends": [
    "airbnb",
  ],
  "rules" : {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "semi": ["error", "never"],
    "@typescript-eslint/semi": ["error", "never"],
    "quotes": ["error", "double"],
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".tsx"
        ]
      }
    ],
    "no-underscore-dangle": ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"] }],
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "max-len": ["error", {
      "code": 100,
      "ignorePattern": "http([\s\S]*?)"
    }]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
        "paths": ["src"]
      }
    }
  },
  "overrides": [
    {
      "files": ["*.test.*"],
      "env": {
        "jest": true,
      }
    }
  ]
}
