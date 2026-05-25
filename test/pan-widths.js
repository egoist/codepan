require('babel-register')({
  presets: [['env', { modules: 'commonjs' }]],
  ignore: /node_modules/
})

const assert = require('assert')
const { parsePanWidths, getPanPosition } = require('../src/utils/pan-widths')

const visiblePans = ['js', 'console', 'output']

assert.deepStrictEqual(parsePanWidths('25,25,50', visiblePans), [25, 25, 50])
assert.deepStrictEqual(parsePanWidths('1,1,2', visiblePans), [25, 25, 50])
assert.deepStrictEqual(parsePanWidths('25%, 25%, 50%', visiblePans), [25, 25, 50])
assert.deepStrictEqual(parsePanWidths('output:50,js:25,console:25', visiblePans), [25, 25, 50])
assert.deepStrictEqual(parsePanWidths('js:1,console:1,output:2', visiblePans), [25, 25, 50])
assert.deepStrictEqual(parsePanWidths(['25,25,50'], visiblePans), [25, 25, 50])

assert.strictEqual(parsePanWidths('', visiblePans), null)
assert.strictEqual(parsePanWidths('25,25', visiblePans), null)
assert.strictEqual(parsePanWidths('25,nope,50', visiblePans), null)
assert.strictEqual(parsePanWidths('25,-1,50', visiblePans), null)
assert.strictEqual(parsePanWidths('js:25,output:75', visiblePans), null)
assert.strictEqual(parsePanWidths('js:25,console:25,output:0', visiblePans), null)
assert.strictEqual(parsePanWidths('js:25,console:25,output:25,html:25', visiblePans), null)
assert.strictEqual(parsePanWidths('missing:25,console:25,output:50', visiblePans), null)

assert.deepStrictEqual(
  getPanPosition(visiblePans, 'js', [25, 25, 50]),
  { left: '0%', right: '75%' }
)
assert.deepStrictEqual(
  getPanPosition(visiblePans, 'console', [25, 25, 50]),
  { left: '25%', right: '50%' }
)
assert.deepStrictEqual(
  getPanPosition(visiblePans, 'output', [25, 25, 50]),
  { left: '50%', right: '0%' }
)
assert.strictEqual(getPanPosition(['js', 'output'], 'output', [25, 25, 50]), null)
