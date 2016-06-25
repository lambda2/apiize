
import chai from 'chai';
import { get } from 'get-content';
import Apiize from '../lib';
import cli from '../lib/cli';

const assert = chai.assert;

const jsonTestFile = './test/datasets/punchlines.json';
// const jsonTestBadFile = 'test/datasets/bad_json.json';
// const jsonTestInexistantFile = './i-dont-exist.json';
const jsonTestUrl = 'http://opendata.paris.fr/explore/dataset/les-1000-titres-les-plus-reserves-dans-les-bibliotheques-de-pret/download\?format\=json';

describe('apiize', function () {

  describe('cli', function () {
    it('should handle args', function (done) {

      // Thug life
      let oldArgvs = process.argv;
      process.argv = ['node', 'apiize', '-v', '-p', '1234', 'tata'];
      let program = cli();
      assert.equal(program.port, 1234, 'port should be set');
      assert.isTrue(program.verbose, 'verbose is enabled');
      process.argv = oldArgvs;
      done();
    });
  });

  describe('boot', function () {

    it('should not be nil', function (done) {
      let apiize = new Apiize(jsonTestFile);
      assert.isOk(apiize, 'should not be nil');
      done();
    });

    it('should be created from file', function (done) {
      // this.timeout(10000);
      let apiize = new Apiize(jsonTestFile);
      apiize.on('ready', function (e) {
        assert.isOk(e, 'should not be nil');
        assert.isOk(e.rawData, 'should not be nil');
        done();
      });
    });

    // it('should fail on unparsable file', function () {
    //   this.timeout(10000);
    //   assert.throws(() => {
    //     new Apiize(jsonTestBadFile);
    //   }, Error, /content is not parsable/, 'must throw an error');
    // });

    it('should be created from url', function (done) {
      this.timeout(5000);
      let apiize = new Apiize(jsonTestUrl);
      apiize.on('ready', function (e) {
        assert.isOk(e, 'should not be nil');
        assert.isOk(e.rawData, 'should not be nil');
        done();
      });
    });

    it('should create server', function (done) {
      // this.timeout(5000);
      let apiize = new Apiize(jsonTestFile);
      apiize.on('ready', function (e) {
        assert.isOk(e, 'should not be nil');
        assert.isOk(e.rawData, 'should not be nil');
        assert.isUndefined(e.server, 'should be nil');
        e.serve();
        assert.isOk(e.server, 'should be created');
        get(`http://localhost:${e.server.params.port}`).then((response) => {
          console.log("Content: ", response);
          assert.match(response, /This api only respond to json/, 'should return html response');
          e.server.stop();
          done();
        }).catch((err) => {
          return done(err);
        });
      });
    });
  });

});
