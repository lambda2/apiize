let program = require('commander');

let Apiize = require('./apiize');
let Info = require('../package.json');

// If we are called from the command line
if (require.main === module) {
  program
    .version(Info.version)
    .usage(`[options] <file>`)
    .option('-p, --port <port>', 'Set the server port (default to 1313)', parseInt)
    .option('-r, --root <root_key>', 'Get only data under the specified root key')
    .option('-v, --verbose', 'Add additional logs')
    .option('-c, --cache', 'Enable static caching')
    .arguments('<file> [options]')
    .action(function (cmd, env, o) {
      let apiize = new Apiize(cmd, o);
      apiize.on('ready', function (e) {
        e.serve();
      });

    })
    .parse(process.argv);
}