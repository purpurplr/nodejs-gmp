const fs = require('fs').promises;

const csv = require('csvtojson');
const { getOptions } = require('./option-parser');

const { input, output } = getOptions();

let result = '';
fs.createReadStream(input)
  .pipe(csv())
  .on('data', (data) => (result += data))
  .on('error', (error) => console.error(error))
  .on('end', () => fs.writeFile(output, result));

// csv({ downstreamFormat: 'line' })
//   .fromFile(input)
//   .then(
//     (result) => fs.writeFile(output, result),
//     (error) => console.error(error),
//   );
