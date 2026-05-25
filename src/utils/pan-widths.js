const panNames = ['html', 'css', 'js', 'console', 'output']

const normalizeQueryValue = value => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

const parseWidth = value => {
  const parsed = Number(String(value).trim().replace(/%$/, ''))

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const normalizeWidths = widths => {
  const total = widths.reduce((sum, width) => sum + width, 0)

  if (total <= 0) {
    return null
  }

  return widths.map(width => width / total * 100)
}

const parseEntry = entry => {
  const separator = entry.indexOf(':')

  if (separator === -1) {
    return {
      width: parseWidth(entry)
    }
  }

  return {
    pan: entry.slice(0, separator).trim(),
    width: parseWidth(entry.slice(separator + 1))
  }
}

const parseEntries = value => {
  return String(value)
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(parseEntry)
}

const parseNamedWidths = (entries, visiblePans) => {
  const widthsByPan = {}

  for (const { pan, width } of entries) {
    if (!pan || panNames.indexOf(pan) === -1 || width === null || widthsByPan[pan]) {
      return null
    }

    widthsByPan[pan] = width
  }

  const widths = visiblePans.map(pan => widthsByPan[pan])

  if (Object.keys(widthsByPan).length !== visiblePans.length || widths.some(width => width === undefined)) {
    return null
  }

  return normalizeWidths(widths)
}

const parseOrderedWidths = (entries, visiblePans) => {
  if (entries.length !== visiblePans.length || entries.some(({ pan, width }) => pan || width === null)) {
    return null
  }

  return normalizeWidths(entries.map(({ width }) => width))
}

const formatPercent = value => `${Number(value.toFixed(6))}%`

export const parsePanWidths = (value, visiblePans) => {
  value = normalizeQueryValue(value)

  if (!value || !Array.isArray(visiblePans) || visiblePans.length === 0) {
    return null
  }

  const entries = parseEntries(value)

  if (entries.length === 0) {
    return null
  }

  const hasNamedEntries = entries.some(({ pan }) => pan)

  return hasNamedEntries ?
    parseNamedWidths(entries, visiblePans) :
    parseOrderedWidths(entries, visiblePans)
}

export const getPanPosition = (visiblePans, pan, widths) => {
  const index = visiblePans.indexOf(pan)

  if (!widths || index === -1 || widths.length !== visiblePans.length) {
    return null
  }

  const left = widths.slice(0, index).reduce((sum, width) => sum + width, 0)
  const width = widths[index]
  const right = Math.max(0, 100 - left - width)

  return {
    left: formatPercent(left),
    right: formatPercent(right)
  }
}
