import globals from "globals";

export default [
  // ✅ MS (Vite) : code navigateur
  {
    files: ["src/**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ScrollReveal: "readonly",
        particlesJS: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      eqeqeq: ["error", "always"]
    }
  },

  // ✅ MB (Express/Node) : code serveur
  {
    files: ["server/**/*.{js,mjs}", "*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
