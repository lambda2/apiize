let program = require('commander');
let fs = require('fs');

let Apify = require('./apify');
let Info = require('../package.json');


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

// If we are called from the command line
if (require.main === module) {
  console.log('called directly');

  program
    .version(Info.version)
    .usage(`${Info.name} [options] <file>`)
    .option('-d, --dataset [file]', 'An external dataset to use', checkFile)
    .option('-s, --suites [suite]', 'Run only specified suite', collect, [])
    .option('-v, --verbose', 'Add additional logs')
    .arguments('<file> [options]')
    .action(function (cmd, env) {
      console.log("Action !", cmd, env);
      let apify = new Apify(cmd);
      apify.serve();
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
} else {
  console.log('required as a module');
}

export default Apify;
