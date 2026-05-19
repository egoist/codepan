require('babel-register')({
  presets: [['env', { modules: 'commonjs' }]],
  ignore: /node_modules/
})

const assert = require('assert')
const { parsePanWidths, getPanPosition } = require('../src/utils/pan-widths')

assert.deepStrictEqual(parsePanWidths('25,25,50'), [25, 25, 50])
assert.deepStrictEqual(parsePanWidths('1,1,2'), [25, 25, 50])
assert.strictEqual(parsePanWidths('25,nope,50'), null)
assert.strictEqual(parsePanWidths('25,-1,50'), null)
assert.strictEqual(parsePanWidths(''), null)
assert.deepStrictEqual(
  getPanPosition(['js', 'console', 'output'], 'js', [25, 25, 50]),
  { left: '0%', right: '75%' }
)
assert.deepStrictEqual(
  getPanPosition(['js', 'console', 'output'], 'console', [25, 25, 50]),
  { left: '25%', right: '50%' }
)
assert.deepStrictEqual(
  getPanPosition(['js', 'console', 'output'], 'output', [25, 25, 50]),
  { left: '50%', right: '0%' }
)
assert.strictEqual(getPanPosition(['js', 'output'], 'output', [25, 25, 50]), null)
