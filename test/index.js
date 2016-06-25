
import chai from 'chai';
import { get } from 'get-content';
import Apify from '../lib';

const assert = chai.assert;

const jsonTestFile = './test/datasets/punchlines.json';
// const jsonTestBadFile = 'test/datasets/bad_json.json';
// const jsonTestInexistantFile = './i-dont-exist.json';
const jsonTestUrl = 'http://opendata.paris.fr/explore/dataset/les-1000-titres-les-plus-reserves-dans-les-bibliotheques-de-pret/download\?format\=json';

describe('apify', function () {

  describe('boot', function () {

    it('should not be nil', function (done) {
      let apify = new Apify(jsonTestFile);
      assert.isOk(apify, 'should not be nil');
      done();
    });

    it('should be created from file', function (done) {
      // this.timeout(10000);
      let apify = new Apify(jsonTestFile);
      apify.on('ready', function (e) {
        assert.isOk(e, 'should not be nil');
        assert.isOk(e.rawData, 'should not be nil');
        done();
      });
    });

    // it('should fail on unparsable file', function () {
    //   this.timeout(10000);
    //   assert.throws(() => {
    //     new Apify(jsonTestBadFile);
    //   }, Error, /content is not parsable/, 'must throw an error');
    // });

    it('should be created from url', function (done) {
      this.timeout(5000);
      let apify = new Apify(jsonTestUrl);
      apify.on('ready', function (e) {
        assert.isOk(e, 'should not be nil');
        assert.isOk(e.rawData, 'should not be nil');
        done();
      });
    });

    it('should create server', function (done) {
      // this.timeout(5000);
      let apify = new Apify(jsonTestFile);
      apify.on('ready', function (e) {
        assert.isOk(e, 'should not be nil');
        assert.isOk(e.rawData, 'should not be nil');
        assert.isUndefined(e.server, 'should be nil');
        e.serve();
        assert.isOk(e.server, 'should be created');
        get(`http://localhost:${e.server.params.port}`).then((response) => {
          console.log("Content: ", response);
          done();
        }).catch((err) => {
          return done(err);
        });
      });
    });
  });

});
