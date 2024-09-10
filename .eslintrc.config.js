import antfu from "@antfu/eslint-config";

export default antfu({
  formatters: true,
  svelte: true,
  typescript: true,
  stylistic: {
    quotes: "single",
    indent: 2,
  },
});
