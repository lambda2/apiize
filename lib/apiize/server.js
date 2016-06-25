require('colors');
let morgan = require('morgan');
let express = require('express');
let app = express();
let expressRouter = express.Router;
let responseTime = require('response-time');

class Server {

  // Create a new Express server
  constructor(apiize, params = {}) {

    const defaults = {
      port: 1313,
      prefix: 'api'
    };

    this.apiize = apiize;
    this.params = Object.assign(defaults, params);
    app.use(responseTime());

    // Set json header
    app.use(function (req, res, next) {
      res.header('Content-Type', 'application/json');
      next();
    });

    console.log(this.apiize.params.verbose);
    app.use(morgan(this.apiize.params.verbose ? 'combined' : 'tiny'));

    this.server = false;
    this.routes = this.apiize.routes();

    // Mount routes
    app.use('/api', this.router());
    app.use(this.index());
    app.use(function (req, res) {
      res.status(404).json({error: 'Not found', message: `Unable to find route to ${req.path}`});
    });
  }

  // Handle root path
  index() {
    let router = expressRouter();

    router.get('/', (req, res) => {
      res.format({

        'text/html': function (){
          // The client requested an html page
          res.send(`
            <p>This api only respond to json, please try to request this endpoint with <code>application/json</code> Content Type.</p>
          `);
        },
        default: () => {
          // Will print the index ouf available routes
          res.json(this.jsonIndex(this.routes));
        }
      });
    });

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    for (const route of this.routes) {
      router.get(route.route, route.callback);
    }

    return router;
  }

  // Create index ouf routes on the root path
  jsonIndex(routes) {
    if (!this.indexCache) {
      this.indexCache = {
        endpoints: routes.map((r) => {
          return {url: `/${this.params.prefix}${r.route}`, description: r.info};
        })
      };
    }
    return this.indexCache;
  }

  // Create routes
  router() {
    let router = expressRouter();
    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    for (const route of this.routes) {
      router.get(route.route, route.callback);
    }

    return router;
  }

  // Stop the server
  stop() {
    if (this.server) {
      this.server.close();
      this.server = false;
    }
  }

  // Say hello and print routes
  hello() {
    console.log(`\n  ___        _ _         \n / _ \\      (_|_)        \n/ /_\\ \\_ __  _ _ _______ \n|  _  | '_ \\| | |_  / _ \\\n| | | | |_) | | |/ /  __/\n\\_| |_/ .__/|_|_/___\\___|\n      | |                \n      |_|                \n    `.blue);
    console.log('💫 ' + ` Express has taken the stage and is listening on port ${this.params.port}\n`.green);
    for (const route of this.routes) {
      let info = route.info ? ` ${route.info}`.grey : '';
      console.log('∙ '.green + `GET /${this.params.prefix}${route.route}` + info);
    }
  }

  // Start the server
  listen() {
    this.server = app.listen(this.params.port);
    this.hello();
  }

}

export default Server;
