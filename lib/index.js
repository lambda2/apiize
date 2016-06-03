let program = require('commander');
let fs = require('fs');

let Apify = require('./cumbaya');
let Info = require('../package.json');

// If we are called from the command line
if (require.main === module) {
  console.log('called directly');
} else {
  console.log('required as a module');
}

let checkFile = (file) => {
  try {
    let stats = fs.lstatSync(file);
    if (stats.isFile()) {
      return file;
    } else {
      throw new Error();
    }
  } catch (e) {
    console.error(`Unable to find specified dataset (${file})`);
    process.exit(1);
  }
};

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .version(Info.version)
  .usage(`${Info.name} [options] <program>`)
  .option('-d, --dataset [file]', 'An external dataset to use', checkFile)
  .option('-s, --suites [suite]', 'Run only specified suite', collect, [])
  .option('-v, --verbose', 'Add additional logs')
  .arguments('<program> [options]')
  .action(function (cmd, env) {
     console.log("Action !", cmd, env);
  })
  .parse(process.argv);

console.log(' dataset: %j', program.dataset);
console.log(' suites: %j', program.suites);
console.log(' verbose: %j', program.verbose);
// program.range = program.range || [];
// console.log(' range: %j..%j', program.range[0], program.range[1]);
// console.log(' list: %j', program.list);
// console.log(' collect: %j', program.collect);
// console.log(' verbosity: %j', program.verbose);
console.log(' args: %j', program.args);


export default Apify;
