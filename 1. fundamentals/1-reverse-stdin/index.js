const readline = require('readline');

const stdinInterface = readline.createInterface({
  input: process.stdin,
});

stdinInterface.on('line', (input) => {
  const result = input.split('').reverse().join('');
  console.log(result);
});
