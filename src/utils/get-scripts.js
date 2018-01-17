import parse from 'parse-import-es6'
import parsePackageName from 'parse-package-name'

export default (code, scripts) => {
  if (!/\bimport\b/.test(code)) return code

  const replacements = []
  for (const [index, item] of parse(code).entries()) {
    const moduleName = `__npm_module_${index}`
    const pkg = parsePackageName(item.moduleSpecifier)
    const version = pkg.version || 'latest'
    scripts.push({
      path: pkg.path ? `/${pkg.path}` : '',
      name: moduleName,
      module: pkg.name === 'vue' ?
        `vue@${version}/dist/vue.esm.js` :
        `${pkg.name}@${version}`
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
    if (replacement) {
      replacements.push(replacement)
    }
    code = code.slice(0, item.range.start) + ' '.repeat(item.range.end - item.range.start) + code.slice(item.range.end)
  }

  if (replacements.length > 0) {
    code = replacements.join('\n') + code
  }

  return code
}
