import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "mobile/**",
      "dist/**",
      "coverage/**",
      "prisma/migrations/**"
    ]
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off"
    }
  }
];

export default eslintConfig;
