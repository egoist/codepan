const getPanWidths = (pans, widths = {}) => {
  const customWidths = pans.reduce((res, pan) => {
    const width = Number(widths[pan])
    if (width > 0) {
      res[pan] = width
    }
    return res
  }, {})
  const customTotal = Object.keys(customWidths).reduce((res, pan) => {
    return res + customWidths[pan]
  }, 0)
  const missingPans = pans.filter(pan => !customWidths[pan])
  const remaining = Math.max(100 - customTotal, 0)
  const fallbackWidth = missingPans.length > 0 ? remaining / missingPans.length : 0
  const rawWidths = pans.map(pan => customWidths[pan] || fallbackWidth)
  const total = rawWidths.reduce((res, width) => res + width, 0)

  if (total === 0) {
    return pans.map(() => 100 / pans.length)
  }

  return rawWidths.map(width => width / total * 100)
}

const suffix = value => {
  return value === 0 ? 0 : `${value}%`
}

export default (pans, pan, widths) => {
  const panWidths = getPanWidths(pans, widths)
  const panIndex = pans.indexOf(pan)

  if (panIndex === -1) {
    return {}
  }

  const left = panWidths.slice(0, panIndex).reduce((res, width) => {
    return res + width
  }, 0)
  const right = panWidths.slice(panIndex + 1).reduce((res, width) => {
    return res + width
  }, 0)

  if (pan === 'html') {
    return {
      left: 0,
      right: suffix(right)
    }
  }

  if (pan === 'css') {
    return {
      left: suffix(left),
      right: suffix(right)
    }
  }

  if (pan === 'js') {
    return {
      left: suffix(left),
      right: suffix(right)
    }
  }

  if (pan === 'console') {
    return {
      left: suffix(left),
      right: suffix(right)
    }
  }

  if (pan === 'output') {
    return {
      left: suffix(left),
      right: 0
    }
  }
}
