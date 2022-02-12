const baseConfig = require('./stylelint.base.config')

module.exports = {
  ...baseConfig,
  customSyntax: 'postcss-less',
}
