import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";



export default defineConfig([
   {
    ignores: [
      "package.json",
      "**/dist/**",
      "app/**"
    ], // 忽略 abc 文件夹及其子目录下的所有文件
  },
  { files: ["src/*.{js,mjs,cjs,ts,vue}"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["src/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: { globals: globals.browser },
    rules: {
      indent: ["error", 4], // 缩进 2 个空格
      semi: ["error", "always"], // 强制分号
      "no-console": ["error"], // 允许 .js 文件中使用 console
      "no-require": "off", // 允许使用 require
      "no-any":"off",
      "prefer-const":"off"
    },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } },rules:{ "@typescript-eslint/no-explicit-any": "off", } },
]);
