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
    console.error(`Unable to open (${file})`);
    process.exit(1);
  }
};

// If we are called from the command line
if (require.main === module) {
  program
    .version(Info.version)
    .usage(`[options] <file>`)
    .option('-p, --port <port>', 'Set the server port (default to 1313)', parseInt)
    .option('-v, --verbose', 'Add additional logs')
    .option('-c, --cache', 'Enable static caching')
    .arguments('<file> [options]')
    .action(function (cmd, env, o) {
      console.log('Action !', cmd, env, o);
      let apify = new Apify(cmd, o);
      apify.on('ready', function (e) {
        e.serve();
      });

    })
    .parse(process.argv);
}

export default Apify;
