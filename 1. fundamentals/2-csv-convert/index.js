const fs = require('fs');
const { pipeline } = require('stream');

const csv = require('csvtojson');
const { getOptions } = require('./option-parser');

const { input, output } = getOptions();

pipeline(fs.createReadStream(input), csv(), fs.createWriteStream(output), (err) => {
  if (err) console.error(err);
});
