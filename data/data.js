const path = require('path');
const fs = require('fs');

let dataset = [];

let addressesDirectory = path.join(__dirname, 'addresses');

fs.readdir(addressesDirectory, function (error, data) {
  data.filter(el => el.endsWith('.json')).forEach(el => dataset.push(...require(path.join(addressesDirectory, el))));
});

module.exports = dataset;
