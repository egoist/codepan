const gh = require('gh-pages')

const ci = process.env.CI

gh.publish('dist', {
  repo: ci ? 'https://' + process.env.GH_TOKEN + '@github.com/egoist/codepan.git' : 'git@github.com:egoist/codepan.git',
  silent: ci
}, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('done!')
})
