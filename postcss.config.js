const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-preset-env')({
      // browsers: ['last 1 Chrome version'], // see package.json
      // stage: 1, // 2 is default
      // Full list of features: https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js#L36
      // and https://preset-env.cssdb.org/features
      features: {
        'nesting-rules': true, // delete if you don’t want nesting (optional)
      },
    }),

    // Minify if prod
    !dev &&
      require('cssnano')({
        preset: ['default', { discardComments: { removeAll: true } }],
      }),
  ],
}
