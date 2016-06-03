let _ = require('lodash');
let validUrl = require('valid-url');
let Type = require('type-of-is');
let { stringToSlug } = require('./utils');
let pluralize = require('pluralize');
let jsonfile = require('jsonfile');
let mkpath = require('mkpath');
let Server = require('./server');
// let expect = require('expect.js');

class Apify {



  constructor(data, params = {}) {

    const defaults = {cache: true};
    this.params = Object.assign(defaults, params);

    if (typeof data !== 'string') {
      throw `The provided callback must be a string (got ${typeof data})`;
    }
    this.dataToJson(data);
    console.log(this.rawData);
    this.generate();
    this.cache = {};
  }


  dataToJson(data) {
    if (validUrl.isUri(data))
    {
      console.log("Url to be loaded");
    }
    else {
      this.rawData = require(data);
    }
  }

  generate() {
    // We colection all the available keys
    let keys = [];
    let values = {};
    let currentId = 1;
    _.each(this.rawData, (e, i) => {
      if (_.has(e, 'id') && Type.is(e.id, "Integer")) {
        if (e.id > currentId)
          currentId = (e.id + 1)
      } else {
        this.rawData[i].id = currentId;
        currentId++;
      }
    });
    _.each(this.rawData, function(e) {
      _.each(_.omit(e, ['id']), function(v, k) {
        console.log("Parsing object ", e);
        console.log(`On key ${k} -> value ${v}`);
        if (!_.isEmpty(k))
        {
          let arrayData = (Type.is(v, "Array") ? v : [v]);
          let slug = stringToSlug(k);
          if (!_.has(values, slug))
            values[slug] = {}
          _.each(arrayData, function(key){
            if (!_.isEmpty(key))
            {
              let keySlug = stringToSlug(key);
              values[slug][keySlug] = (values[slug][keySlug] ? _.union(values[slug][keySlug], [e.id]) : [e.id]);
            }
          })
          // values[k] = (values[k] ? _.union(values[k], arrayData) : arrayData);
        }
      });
    });
    console.log("After generation: ", values);
    // let structured = {};
    // _.each(keys, function(e){
    //   structured[e] = 
    // });
    // return values;
    this.data = values
  }

  indexCallbackForResource(res, req, resource, values) {
    let response = _.map(values, function(val, key){
      return {
        [resource]: key,
        url: `/${resource}/${key}`,
        count: val.length
      }
    });
    res.json(response);
    this.saveCache(req.path, response);
  }

  showCallbackForResource(res, req, values, slug) {
    console.log("searching for slug", slug);
    let ids = values[slug];
    console.log("ids ->", ids);
    console.log(this.rawData[0]);
    let response = _.map(ids, (e) => {
      return _.find(this.rawData, {id: e});
    });
    res.json(response);
    this.saveCache(req.path, response);
  }


// var jsonfile = require('jsonfile')

// var file = '/tmp/data.json'
// var obj = {name: 'JP'}

// jsonfile.writeFile(file, obj, function (err) {
//   console.error(err)
// })

  saveCache(path, content) {
    if (this.params.cache)
    {
      let file = `.cache${path}`;
      let folder = file.split('/').slice(0, -1).join('/');
      mkpath(folder, function (err) {
          if (err)
            console.warn(err);
          console.log(`Directory structure ${folder} created`);
          jsonfile.writeFile(file, content, function (err) {
            console.warn(err);
          });
      });
    }
  }


  routes() {
    return _.flatten(_.map(this.data, (v, k) => {
      let indexRoute = `/${pluralize(k)}`;
      let showRoute = `/${k}/:id`;
      return [{
        route: indexRoute,
        info: `The index of ${pluralize(k)}`,
        callback: (req, res) => {
          this.indexCallbackForResource(res, req, k, v);
        }
      },
      {
        route: showRoute,
        callback: (req, res) => {
          this.showCallbackForResource(res, req, v, req.params.id);
        }
      }]
    }));
  }

  serve() {
    let server = new Server(this, this.params);
    server.listen();
  }




}

export default Apify;
