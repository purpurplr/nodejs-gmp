import * as fs from 'fs';
import { pipeline } from 'stream';

import csv from 'csvtojson';
import { getOptions } from './option-parser';

const { input, output } = getOptions();

pipeline(fs.createReadStream(input), csv(), fs.createWriteStream(output), (err) => {
  if (err) console.error(err);
});
