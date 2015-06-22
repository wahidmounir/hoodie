var expect = require('expect.js');
var hoodie_server = require('../../');
var http = require('http');
var zlib = require('zlib');
var os = require('os');

var config = {
  www_port: 5100,
  admin_port: 5110,
  admin_password: '12345'
};

describe('handle forced gzip', function () {
  this.timeout(30000);

  it('should receive gzip when gzip accept header sent', function (done) {
    http.get({
      host: '127.0.0.1',
      port: config.www_port,
      method: 'get',
      path: '/_api/',
      headers: {
        'Accept-Encoding': 'gzip, deflate'
      }
    }, function (res) {
      expect(res.headers['content-encoding']).to.be('gzip');
      res.on('end', function() {
        done();
      });

      var gunzip = zlib.createGunzip();
      gunzip.on('error', function(error){
        console.log('Error, ', error);
        done(error);
      });

      res.pipe(gunzip);

    });
  });

  it('should receive no gzip when no gzip accept header sent', function (done) {
    http.get({
      host: '127.0.0.1',
      port: config.www_port,
      method: 'get',
      path: '/_api/',
    }, function (res) {
      expect(res.headers['content-encoding']).to.be(undefined);
      done();
    });
  });

  it('should receive gzip when no gzip accept header sent but force query param', function (done) {
    http.get({
      host: '127.0.0.1',
      port: config.www_port,
      method: 'get',
      path: '/_api/?gzip=force',
    }, function (res) {
      expect(res.headers['content-encoding']).to.be('gzip');
      res.on('end', function() {
        done();
      });

      var gunzip = zlib.createGunzip();
      gunzip.on('error', function(error){
        console.log('Error, ', error);
        done(error);
      });

      res.pipe(gunzip);
    });
  });

  it('should receive a force-gzip html file', function (done) {
    http.get({
      host: '127.0.0.1',
      port: config.www_port,
      method: 'get',
      path: '/_api/_files/force-gzip.html',
      agent: false
    }, function (res) {
      expect(res.statusCode).to.be(200);
      done();
    });
  });


});
