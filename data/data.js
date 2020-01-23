const path = require('path');
const fs = require('fs');

let dataset = [];

let addressesDirectory = path.join(__dirname, 'addresses');

fs.readdirSync(addressesDirectory).filter(el => el.endsWith('.json')).forEach(function (el) {
  dataset.push(...JSON.parse(fs.readFileSync(path.join(addressesDirectory, el), 'utf8')));
});

module.exports = dataset;
