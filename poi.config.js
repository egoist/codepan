const { execSync } = require("child_process");
const nodeModules = require("webpack-node-modules");
const pkg = require("./package");

const LATEST_COMMIT = (
  process.env.COMMIT_HASH ||
  execSync('if [ -d ".git" ]; then git rev-parse HEAD; fi', {
    encoding: "utf8",
  })
).slice(0, 7);

const cdns = {
  BABEL_CDN: "https://unpkg.com/@babel/standalone@7.0.0-beta.32/babel.js",
  PUG_CDN: "https://cdn.jsdelivr.net/npm/browserified-pug@0.3.0/index.js",
  CSSNEXT_CDN:
    "https://cdn.jsdelivr.net/npm/browserified-postcss-cssnext@0.3.0/index.js",
  POSTCSS_CDN:
    "https://cdn.jsdelivr.net/npm/browserified-postcss@0.3.0/index.js",
  TYPESCRIPT_CDN:
    "https://cdn.jsdelivr.net/npm/browserified-typescript@0.3.0/index.js",
};

module.exports = {
  entry: "./src/index.js",
  output: {
    sourceMap: false,
    publicUrl: "/",
  },
  chainWebpack(config) {
    config.module.set("noParse", /babel-preset-poi/);
    config.module.rule("js").include.add(nodeModules());
    config.node.set("fs", "empty");
    config.externals({
      electron: "commonjs electron",
    });
  },
  plugins: [
    { resolve: "poi-preset-bundle-report" },
    { resolve: "poi-preset-babel-minify", options: { removeUndefined: false } },
    {
      resolve: "poi-preset-offline",
      options: {
        version: "[hash]",
        autoUpdate: true,
        safeToUseOptionalCaches: true,
        caches: {
          main: ["index.html", "client.*", "vendor.*", "editor-page.chunk.js"],
          additional: ["*.chunk.js", ":externals:"],
          optional: [":rest:"],
        },
        ServiceWorker: {
          events: true,
          navigateFallbackURL: "/",
        },
        AppCache: {
          events: true,
          FALLBACK: { "/": "/" },
        },
        externals: [].concat(
          Object.keys(cdns).reduce((res, name) => {
            return res.concat(cdns[name]);
          }, [])
        ),
      },
    },
  ],
  envs: Object.assign(
    {
      VERSION: `v${pkg.version}-${LATEST_COMMIT}`,
      LATEST_COMMIT,
    },
    cdns
  ),
};
