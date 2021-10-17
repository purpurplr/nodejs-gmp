const { Command } = require('commander');

const program = new Command();
program.requiredOption('-i, --input <input>').requiredOption('-o, --output <output>');

function getOptions() {
  program.parse(process.argv);
  return program.opts();
}

module.exports = { getOptions };
