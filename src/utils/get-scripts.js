export default (code, scripts) => {
  if (!/\b(require|import)\b/.test(code)) return code

  const DEFAULT_IMPORT_RE = /import\s+(\w+)\s+from\s+[\'\"](\w+)[\'\"]/
  let matchedDefaultImport
  if (matchedDefaultImport = DEFAULT_IMPORT_RE.exec(code)) {
    scripts.push({
      variable: matchedDefaultImport[1],
      package: matchedDefaultImport[2]
    })
    code = code.replace(DEFAULT_IMPORT_RE, '')
  }

  return code
}
