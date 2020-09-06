const fs = require('fs')

const package = JSON.parse(fs.readFileSync(__dirname + '/../package.json'))
fs.writeFileSync(__dirname + '/../static/version.txt', package.version)
