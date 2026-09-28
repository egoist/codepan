import assert from 'assert'
import fs from 'fs'

// Load the real ES module without changing this legacy application's module mode.
const source = fs.readFileSync(new URL('../src/utils/pan-position.js', import.meta.url), 'utf8')
const { default: position } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
const pans = ['html', 'css', 'js', 'console', 'output']
const close = (actual, expected) => assert(Math.abs(parseFloat(actual) - expected) < 1e-10)

assert.deepStrictEqual(position(['js', 'console', 'output'], 'console', '2,1,7'), { left: '20%', right: '70%' })
assert.deepStrictEqual(position(['output', 'console', 'js'], 'console', '2,1,7'), { left: '20%', right: '70%' })
assert.deepStrictEqual(position(['js', 'output'], 'js', '1,3'), { left: 0, right: '75%' })
assert.deepStrictEqual(position(['js', 'output'], 'output', '1,3'), { left: '25%', right: 0 })
assert.deepStrictEqual(position(['output'], 'output', '999'), { left: 0, right: 0 })
assert.deepStrictEqual(position([], 'html', '1'), {})
assert.deepStrictEqual(position(['js'], 'html', '1'), {})

for (const invalid of [undefined, null, '', '1', '1,2,3', '0,1', '-1,2', 'NaN,1', 'Infinity,1', '1e308,1e308', ',1', 'no,1', ['1,3', '2,2']]) {
  assert.deepStrictEqual(position(['js', 'output'], 'js', invalid), { left: 0, right: '50%' }, `fallback for ${invalid}`)
}
assert.deepStrictEqual(position(['js', 'output'], 'js', ' .5 , 1.5 '), { left: 0, right: '75%' })

// Every subset remains contiguous, inside its container, and sums to 100%.
for (let mask = 1; mask < 32; mask++) {
  const shown = pans.filter((pan, index) => mask & (1 << index))
  for (const widths of [undefined, shown.map((pan, index) => index + 1).join(',')]) {
    let previousEnd = 0
    for (const pan of shown) {
      const style = position(shown, pan, widths)
      close(style.left, previousEnd)
      const end = 100 - parseFloat(style.right)
      assert(end > previousEnd)
      previousEnd = end
    }
    close(previousEnd, 100)
  }
}
// A changed query recomputes all positions; removing it restores equal widths.
assert.notDeepStrictEqual(position(['js', 'output'], 'js', '1,3'), position(['js', 'output'], 'js', '3,1'))
assert.deepStrictEqual(position(['js', 'output'], 'js'), { left: 0, right: '50%' })
console.log('Panel layout passed: 31 subsets with equal and weighted layouts, malformed queries, order, and updates.')
