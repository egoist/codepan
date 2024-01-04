import parsePackageName from "parse-package-name";
import getImports from "./get-imports";
import { loadBabel } from "./transformer";

export default async (code, scripts) => {
  if (!/\bimport\b/.test(code)) return code;

  await loadBabel();

  const replacements = [];
  const res = getImports(code);
  code = res.code;

  for (const [index, item] of res.imports.entries()) {
    const pkg = parsePackageName(item.module);
    const pkgVersion = pkg.version || "latest";
    const pkgName = pkg.name || `__npm_module_${index}`;
    const pkgNameFormatted = pkgName.match(/([a-z]+)/)[1];
    const moduleName =
      pkgNameFormatted[0].toUpperCase() + pkgNameFormatted.substring(1);

    scripts.push({
      path: pkg.path ? `/${pkg.path}` : "",
      name: pkgName,
      module:
        pkg.name === "vue" && !pkg.path
          ? `vue@${pkgVersion}/dist/vue.esm.js`
          : `${pkg.name}@${pkgVersion}`,
    });

    let replacement = "\n";

    for (const variable of item.variables) {
      replacement += `var ${variable.local} = ${moduleName}.${variable.imported} || ${moduleName};\n`;
    }

    if (replacement) {
      replacements.push(replacement);
    }
  }

  return `${code}${replacements.join("\n")}`;
};
