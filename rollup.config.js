import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import image from "@rollup/plugin-image"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import svelte from "rollup-plugin-svelte"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import sapperConfig from "sapper/config/rollup.js"
import sveltePreprocess from "svelte-preprocess"
import envConfig from "config"
import pkg from "./package.json"

const mode = process.env.NODE_ENV
const dev = mode === "development"
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
  warning.code === "THIS_IS_UNDEFINED" ||
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)

export default {
  client: {
    input: sapperConfig.client.input().replace("js", "ts"),
    output: sapperConfig.client.output(),
    plugins: [
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "process.env.version": JSON.stringify(pkg.version),
        "process.env.url": JSON.stringify(envConfig.get('url')),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess: sveltePreprocess({
          scss: {
            includePaths: ['src/theme'],
          },
        }),
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      image({ include: "**/*.jpg" }),
      typescript({ sourceMap: dev }),

      legacy &&
        babel({
          extensions: [".ts", ".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: {
      ...sapperConfig.server.input(),
      server: sapperConfig.server.input().server.replace("js", "ts"),
    },
    output: sapperConfig.server.output(),
    plugins: [
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "process.env.version": JSON.stringify(pkg.version),
        "process.env.url": JSON.stringify(envConfig.get('url')),
      }),
      svelte({
        generate: "ssr",
        hydratable: true,
        dev,
        preprocess: sveltePreprocess({
          scss: {
            includePaths: ['src/theme'],
          },
        }),
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      image(),
      typescript({ sourceMap: dev }),
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      // ...Object.keys(pkg.devDependencies),
      ...require("module").builtinModules,
    ],

    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: sapperConfig.serviceworker.input(),
    output: sapperConfig.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "process.env.version": JSON.stringify(pkg.version),
        "process.env.url": JSON.stringify(envConfig.get('url')),
      }),
      commonjs(),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
}
