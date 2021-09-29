import { Command } from 'commander';

const program = new Command();
program.requiredOption('-i, --input <input>').requiredOption('-o, --output <output>');

export function getOptions() {
  program.parse(process.argv);
  return program.opts();
}
