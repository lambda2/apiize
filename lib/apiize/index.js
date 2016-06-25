let _ = require('lodash');
let Type = require('type-of-is');
let { stringToSlug } = require('./utils');
let pluralize = require('pluralize');
let jsonfile = require('jsonfile');
let mkpath = require('mkpath');
let isJSON = require('is-json');
let { get } = require('get-content');
let Promise = require('promise');
let Server = require('./server');
const EventEmitter = require('events');

class Apiize extends EventEmitter {

  // Take the url or the file to apiize
  constructor(data, params = {}) {
    super();

    const defaults = {cache: true};
    this.params = Object.assign(defaults, params);
    this.server = undefined;

    if (typeof data !== 'string') {
      throw `The provided file or url must be a string (got ${typeof data})`;
    }
    this.dataToJson(data).then((response) => {
      // console.log("Response got !", response, typeof response);
      this.rawData = response;
      this.generate();
      this.emit('ready', this);
    }).catch(() => {
      console.warn(`The ${data} content is not parsable.`);
      throw new Error(`The ${data} content is not parsable.`);
    });
  }

  dataToJson(data) {
    return new Promise(function (accept, reject) {
      get(data).then((content) => {
        if (isJSON(content)) {
          accept(JSON.parse(content));
        } else {
          reject(content);
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }

  generate() {
    // We collect all the available keys
    console.log("Generate for ", this.rawData.length);
    let values = {};
    let currentId = 1;

    // Manage root key
    if (this.params.root && this.rawData[0][this.params.root]) {
      this.rawData = _.map(this.rawData, (e) => {
        return Object.assign(e.id ? {id: e.id} : {}, e[this.params.root]);
      });
    }

    // Generate ids if needed
    _.each(this.rawData, (e, i) => {
      if (_.has(e, 'id') && Type.is(e.id, 'Integer')) {
        if (e.id > currentId) {
          currentId = e.id + 1;
        }
      } else {
        this.rawData[i].id = currentId;
        currentId++;
      }
    });

    _.each(this.rawData, (e) => {
      _.each(_.omit(e, ['id']), function (v, k) {
        // console.log("Parsing object ", e);
        // console.log(`On key ${k} -> value ${v}`);
        if (!_.isEmpty(k)) {
          let arrayData = Type.is(v, 'Array') ? v : [v];
          let slug = stringToSlug(k);

          if (!_.has(values, slug)) {
            values[slug] = {};
          }

          _.each(arrayData, function (key){
            if (!_.isEmpty(key)) {
              let keySlug = stringToSlug(key);
              values[slug][keySlug] = values[slug][keySlug] ? _.union(values[slug][keySlug], [e.id]) : [e.id];
            }
          });
          // values[k] = (values[k] ? _.union(values[k], arrayData) : arrayData);
        }
      });
    });
    this.data = values;
  }

  indexCallbackForResource(res, req, resource, values) {
    let response = _.map(values, function (val, key) {
      return {
        [resource]: key,
        url: `/${resource}/${key}`,
        count: val.length
      };
    });
    res.json(response);
    this.saveCache(req, response);
  }

  showCallbackForResource(res, req, values, slug) {
    let ids = values[slug];
    let response = _.map(ids, (e) => {
      return _.find(this.rawData, {id: e});
    });
    res.json(response);
    this.saveCache(req, response);
  }

  randomCallbackForAll(res) {
    res.json(_.sample(this.rawData));
  }

  allCallbackForAll(res, req) {
    res.json(this.rawData);
    this.saveCache(req, this.rawData);
  }

  saveCache(req, response) {
    console.log("Save cache for request: ", req);
    if (this.params.cache) {
      let file = `.cache${req}`;
      let folder = file.split('/').slice(0, -1).join('/');
      mkpath(folder, function (err) {
        if (err) {
          console.warn(err);
        }

        // console.log(`Directory structure ${folder} created`);

        jsonfile.writeFile(`${file}.json`, response, function (error) {
          // console.warn(error);
        });
      });
    }
  }


  routes() {
    const resourceRoutes = _.flatten(_.map(this.data, (v, k) => {
      const indexRoute = `/${pluralize(k)}`;
      const showRoute = `/${pluralize(k)}/:id`;
      return [{
        route: indexRoute,
        info: `Return all the ${pluralize(k)}`,
        callback: (req, res) => {
          // console.log("MATCH ROUTE", indexRoute);
          this.indexCallbackForResource(res, req, k, v);
        }
      }, {
        route: showRoute,
        info: `Return the given ${pluralize(k)}`,
        callback: (req, res) => {
          // console.log("MATCH ROUTE", indexRoute);
          this.showCallbackForResource(res, req, v, req.params.id);
        }
      }];
    }));

    const indexRoutes = [
      {
        route: '/',
        info: `Return all items`,
        callback: (req, res) => {
          // console.log("MATCH ROUTE /");
          this.allCallbackForAll(res, req);
        }
      }, {
        route: '/random',
        info: `A random item`,
        callback: (req, res) => {
          // console.log("MATCH ROUTE /random");
          this.randomCallbackForAll(res, req);
        }
      }
    ];
    return [...resourceRoutes, ...indexRoutes];
  }

  serve() {
    this.server = new Server(this, this.params);
    this.server.listen();
  }
}

export default Apiize;
