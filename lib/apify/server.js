
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
    
    // enable static caching
    if (this.params.cache)
      app.use('/api', express.static('.cache'));

    // Mount routes
    app.use('/api', this.router());
  }

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