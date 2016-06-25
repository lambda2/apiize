
let program = require('commander');

let Apiize = require('./apiize');
let Info = require('../package.json');

// If we are called from the command line
export default function () {
  program
    .version(Info.version)
    .usage(`[options] <link>`)
    .option('-p, --port <port>', 'Set the server port (default to 1313)', parseInt)
    .option('-r, --root <root_key>', 'Get only data under the specified root key')
    .option('-v, --verbose', 'Add additional logs')
    .arguments('<link> [options]')
    .action(function (cmd, env, o) {
      let apiize = new Apiize(cmd, o);
      apiize.on('ready', function (e) {
        e.serve();
      });
    })
    .parse(process.argv);

  if (process.argv.length === 2 || program.args.length === 0) {
    program.help();
  }
  return program;
}
