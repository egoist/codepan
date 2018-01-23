import parsePackageName from 'parse-package-name'
import getImports from './get-imports'
import { loadBabel } from './transformer'

export default async (code, scripts) => {
  if (!/\bimport\b/.test(code)) return code

  await loadBabel()

  const replacements = []
  const res = getImports(code)
  code = res.code
  for (const [index, item] of res.imports.entries()) {
    const moduleName = `__npm_module_${index}`
    const pkg = parsePackageName(item.module)
    const version = pkg.version || 'latest'
    scripts.push({
      path: pkg.path ? `/${pkg.path}` : '',
      name: moduleName,
      module: (pkg.name === 'vue' && !pkg.path) ?
        `vue@${version}/dist/vue.esm.js` :
        `${pkg.name}@${version}`
    })
    let replacement = '\n'
    for (const variable of item.variables) {
      if (variable.imported === 'default') {
        replacement += `var ${variable.local} = ${moduleName}.default || ${moduleName};\n`
      } else {
        replacement += `var ${variable.local} = ${moduleName}.${variable.imported};\n`
      }
    }
    if (replacement) {
      replacements.push(replacement)
    }
  }

  if (replacements.length > 0) {
    code = replacements.join('\n') + code
  }

  return code
}
