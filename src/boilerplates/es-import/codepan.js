import babel from '@babel/core'
import env from '@babel/preset-env'

const { code } = babel.transform(`
class Foo {
  bar() {}
}
`, {
  presets: [env]
})

console.log(code)
