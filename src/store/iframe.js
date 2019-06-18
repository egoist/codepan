// lets you specify what tabs are to be opened on init, and what width they should be
// 1 is just on of equal/standard width, and 50 is 50% width
const pans = ['html', 'css', 'js', 'console', 'output']
const nonembed = window.self === window.top
const nulify = val => {
  return nonembed ? null : val
}
const params = window.location.search.slice(1).split('&').map(x => x.split('='))
const paramsO = params.reduce((a, x) => {
  a[x[0]] = x[1]
  return a
}, {})

const selected = pans.filter(x => Boolean(paramsO[x]))
const visiblePans = nulify(selected.length ? selected : null)

const sorted = pans.map(x => paramsO[x]).filter(x => x)
const sortedNames = pans.filter(x => paramsO[x])
const sortLen = sorted.length
const specified = sorted.filter(x => x > 1)
const specLen = specified.length
// width specified
let mutedStyles
if (specLen) {
  const sum = specified.reduce((a, x) => a + Number(x), 0)
  const average = parseFloat((100 - sum) / (sortLen - specLen))
  let left = 0
  mutedStyles = sorted.map(x => {
    let width
    if (x > 1) {
      width = x
    } else {
      width = average
    }
    const res = { left: per(left) }
    left += Number(width)
    res.right = per(100 - left)
    return res
  }).reduce((a, x, i) => {
    a[sortedNames[i]] = x
    return a
  }, {})
}
const initialStyles = mutedStyles || {}
function per(x) {
  return parseFloat(x) + '%'
}
export { visiblePans, paramsO, initialStyles }
