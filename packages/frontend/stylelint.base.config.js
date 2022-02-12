const prettierConfig = require('./prettier.config')

module.exports = {
  extends: [
    // 标准配置
    'stylelint-config-standard',
    // 用于排序
    'stylelint-config-rational-order',
    // 放在最后
    'stylelint-prettier/recommended',
  ],
  plugins: [
    // 提示书写矛盾的样式
    'stylelint-declaration-block-no-ignored-properties',
  ],
  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'prettier/prettier': [true, prettierConfig],
    'rule-empty-line-before': [
      'always',
      {
        // 防止和 prettier 冲突
        except: ['first-nested'],
      },
    ],
    'selector-class-pattern': null,
    'font-family-name-quotes': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
  // stylelint 支持直接配置忽略文件
  ignoreFiles: ['node_modules/**/*', 'dist/**/*', 'src/**/*.{tsx,ts,jsx,js}'],
}
