module.exports = {
  // 扩展 angular 的提交配置
  extends: ["@commitlint/config-angular"],
  // 添加自定义规则
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "ci",
        "chore",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "anno",
      ],
    ],
  },
};
