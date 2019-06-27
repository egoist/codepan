export default (pans = [], pan) => {
  const panWidth = 100 / pans.length
  const pansCount = matchedPans => {
    return pans.filter(p => {
      return matchedPans.indexOf(p) !== -1
    }).length
  }

  const rightOffset = leftCount => pans.length - 1 - leftCount
  const suffix = count => `${count * panWidth}%`

  if (pan === 'html') {
    return {
      top: 0,
      bottom: suffix(rightOffset(0))
    }
  }

  if (pan === 'css') {
    const leftCount = pansCount(['html'])
    return {
      top: suffix(leftCount),
      bottom: suffix(rightOffset(leftCount))
    }
  }

  if (pan === 'js') {
    const leftCount = pansCount(['html', 'css'])
    return {
      top: suffix(leftCount),
      bottom: suffix(rightOffset(leftCount))
    }
  }

  if (pan === 'console') {
    const leftCount = pansCount(['html', 'css', 'js'])
    return {
      top: suffix(leftCount),
      bottom: suffix(rightOffset(leftCount))
    }
  }

  if (pan === 'output') {
    const leftCount = pansCount(['html', 'css', 'js', 'console'])
    return {
      top: suffix(leftCount),
      bottom: 0
    }
  }
}
