import type { Config } from "tailwindcss";

/**
 * Tailwind v4 note: Design tokens are defined in src/styles/globals.css via @theme.
 * This file is kept for IDE tooling and darkMode configuration only.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
