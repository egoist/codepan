module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    indent: ["error", 2],
    "object-curly-spacing": ["error", "always"],
    semi: ["error", "never"],
    quotes: ["error", "single", { allowTemplateLiterals: true }]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
