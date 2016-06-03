
let express = require('express');
let app = express();
let responseTime = require('response-time')
class Server {


  constructor(apify, params = {}) {
    
    const defaults = {
      port: 1313,
      cache: true
    };

    this.apify = apify;
    this.params = Object.assign(defaults, params);
    app.use(responseTime());
    
    app.use(function (req, res, next) {
      res.header("Content-Type",'application/json');
      next();
    });

    // enable static caching
    if (this.params.cache)
      app.use('/api', express.static('.cache', {extensions: ['json']}));

    // Mount routes
    app.use('/api', this.router());
    app.use(this.index());
    app.use(function(req, res, next) {
      res.status(404).json({error: 'Not found', message: `Unable to find route to ${req.path}`});
    });
  }

  index() {
    let router = express.Router();
    let routes = this.apify.routes();

    router.get('/', (req, res) => {
      res.format({

        'text/html': function(){
          res.send('<p>hey</p>');
        },

        'default': () => {
          console.log("default")
          res.json(this.jsonIndex(routes));
        }
      });
    });

    console.log("routes :", routes);
    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    for (const route of routes) {
      console.log("Adding route", route.route, route);
      router.get(route.route, route.callback);
    };
    return router;
  }

  jsonIndex(routes) {
    if (!this.indexCache)
    {
      this.indexCache = {
        endpoints: routes.map((r) => { return {url: r.route, description: r.info}; })
      };
    }
    console.log("Reoutes: ", this.indexCache)
    return this.indexCache;
  };

  router() {
    let router = express.Router();
    let routes = this.apify.routes();
    console.log("routes :", routes);
    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    for (const route of routes) {
      console.log("Adding route", route.route, route);
      router.get(route.route, route.callback);
    };
    return router;
  }

  listen() {
    app.listen(this.params.port);
  }

}
export default Server;