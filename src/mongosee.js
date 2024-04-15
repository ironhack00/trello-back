// mongoose.js
const fs = require('fs');
const path = require('path');

const modelsPath = path.join(__dirname, 'models');

fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => require(path.join(modelsPath, file)));
