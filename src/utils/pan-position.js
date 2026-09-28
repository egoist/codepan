const panOrder = ['html', 'css', 'js', 'console', 'output']

// Weights follow the rendered order, not the order of the `show` query string.
export default (pans, pan, widths) => {
  const visiblePans = panOrder.filter(name => pans.indexOf(name) !== -1)
  const index = visiblePans.indexOf(pan)
  if (index === -1) return {}

  const requested = typeof widths === 'string' ? widths.split(',').map(Number) : []
  const requestedTotal = requested.reduce((total, value) => total + value, 0)
  const valid = requested.length === visiblePans.length &&
    requested.every(value => Number.isFinite(value) && value > 0) &&
    Number.isFinite(requestedTotal)
  const weights = valid ? requested : visiblePans.map(() => 1)
  const total = valid ? requestedTotal : visiblePans.length
  const before = weights.slice(0, index).reduce((sum, value) => sum + value, 0)
  const after = weights.slice(index + 1).reduce((sum, value) => sum + value, 0)

  return {
    left: index === 0 ? 0 : `${before / total * 100}%`,
    right: index === visiblePans.length - 1 ? 0 : `${after / total * 100}%`
  }
}
