// In default.js
// using defer functions is optional. See example and docs below.
// Docs: https://github.com/lorenwest/node-config/wiki/Special-features-for-JavaScript-configuration-files
// var defer = require('config/defer').deferConfig;

module.exports = {
  db: {
    host: "localhost",
    user: "postgres",
    password: "",
  },
}
