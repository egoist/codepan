const toNumber = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const parsePanWidths = value => {
  if (!value) {
    return null
  }

  const widths = String(value)
    .split(',')
    .map(item => toNumber(item.trim()))

  if (widths.some(width => width === null || width <= 0)) {
    return null
  }

  const total = widths.reduce((sum, width) => sum + width, 0)

  if (total <= 0) {
    return null
  }

  return widths.map(width => width / total * 100)
}

export const getPanPosition = (pans, pan, widths) => {
  const index = pans.indexOf(pan)

  if (!widths || index === -1 || widths.length !== pans.length) {
    return null
  }

  const left = widths.slice(0, index).reduce((sum, width) => sum + width, 0)
  const width = widths[index]
  const right = Math.max(0, 100 - left - width)

  return {
    left: `${left}%`,
    right: `${right}%`
  }
}
