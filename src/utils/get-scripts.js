import parse from 'parse-import-es6'

export default (code, scripts) => {
  if (!/\bimport\b/.test(code)) return code

  for (const [index, item] of parse(code).entries()) {
    const moduleName = `__npm_module_${index}`
    scripts.push({
      module: item.moduleSpecifier,
      name: moduleName
    })
    let replacement = '\n'
    if (item.importedDefaultBinding) {
      replacement += `var ${item.importedDefaultBinding} = ${moduleName}.default || ${moduleName};\n`
    }
    if (item.namedImports && item.namedImports.length > 0) {
      for (const namedImport of item.namedImports) {
        const names = namedImport.split(/\s*as\s*/)
        const name = names[1] || names[0]
        replacement += `var ${name} = ${moduleName}.${name};\n`
      }
    }
    if (item.nameSpaceImport) {
      const name = /as\s+(.+)/.exec(item.nameSpaceImport)[1]
      replacement += `var ${name} = ${moduleName};\n`
    }
    code = code.slice(0, item.range.start) + replacement + code.slice(item.range.end)
  }

  return code
}
