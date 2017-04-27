// We can't set postcss in package.json for now
// Due to https://github.com/michael-ciniawsky/postcss-load-plugins/issues/42
module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-property-lookup')
  ]
}
