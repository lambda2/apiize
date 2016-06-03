let _ = require('lodash');
// let { describe, it } = require('mocha');
// let expect = require('expect.js');

class Apify {

  constructor(input, params = {}) {

    this.params = Object.assign(defaults, params);

    if (typeof input !== 'function') {
      throw `The provided callback must be a function (got ${input})`;
    }

  }

}

export default Apify;
