const PAN_ORDER = ['html', 'css', 'js', 'console', 'output']

// Parse `?width=html:25,output:50` style values into { html: 25, output: 50 }.
// Percentages that are missing or invalid fall back to an equal share of the
// space left by pans with an explicit width.
export const parsePanWidths = width => {
  const widths = {}
  if (!width) return widths
  for (const part of String(width).split(',')) {
    const [name, value] = part.split(':')
    const percent = parseFloat(value)
    if (PAN_ORDER.indexOf(name) !== -1 && isFinite(percent)) {
      widths[name] = Math.min(100, Math.max(0, percent))
    }
  }
  return widths
}

export default (pans, pan, widths) => {
  const widthOf = name => {
    if (widths && widths[name] != null) return widths[name]
    const custom = pans.reduce((sum, name) => sum + ((widths && widths[name]) || 0), 0)
    const defaulted = pans.filter(name => !(widths && widths[name] != null)).length
    return defaulted ? (100 - custom) / defaulted : 0
  }
  const left = pans.slice(0, pans.indexOf(pan)).reduce((sum, name) => sum + widthOf(name), 0)
  const width = widthOf(pan)

  return {
    left: `${left}%`,
    right: `${Math.max(0, 100 - left - width)}%`
  }
}
