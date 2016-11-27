"use strict";

const assert = require("assert");
const path = require('path');
const fs = require('fs-extra');
const exec = require('child_process').exec;

const versionUpdate = require("../src/index.js");

function testIncrementFail(testFile,expectedError) {
  return versionUpdate.incrementVersionFile(path.join(__dirname,'testfiles/',testFile))
  .then(data => {
    assert(false,"incrementVersion should not succeed");
  })
  .catch(e => {
    assert.equal(e.status,expectedError);
  });
}

describe('Testing incrementVersion',function() {
  it('should reject with readerror on missing file',function() {
    return testIncrementFail('missing.xml','readerror');
  });
  it('should reject with xmlerror on non-XML file',function() {
    return testIncrementFail('notxml.xml','xmlerror');
  });
  it('should reject with xmlerror on empty file',function() {
    return testIncrementFail('empty.xml','xmlerror');
  });
  it('should reject with formaterror on non-manifest XML file',function() {
    return testIncrementFail('notmanifest.xml','formaterror');
  });
  it('should reject with formaterror if Identity is missing',function() {
    return testIncrementFail('missingidentity.xml','formaterror');
  });
  it('should reject with formaterror if Version is missing',function() {
    return testIncrementFail('missingversion.xml','formaterror');
  });
  it('should reject with versionerror if Version is single number',function() {
    return testIncrementFail('badversion1.xml','versionerror');
  });
  it('should reject with versionerror if Version is not a number pattern',function() {
    return testIncrementFail('badversion2.xml','versionerror');
  });
  it('should work with valid manifest file',function() {
    return versionUpdate.incrementVersionFile(path.join(__dirname,'testfiles/valid.xml'))
    .then(data => {
      assert.equal(data.version,"1.0.0.1");
    });
  });
  it('should work with valid manifest file and overwrite when requested',function(done) {
    fs.copy(path.join(__dirname,'testfiles/valid.xml'),path.join(__dirname,'testfiles/tmp.xml'),function(err) {
      assert.ifError(err);
      versionUpdate.incrementVersionFile(path.join(__dirname,'testfiles/tmp.xml'),true)
      .then(data => {
        assert.equal(data.version,"1.0.0.1");
        return versionUpdate.incrementVersionFile(path.join(__dirname,'testfiles/tmp.xml'));
      })
      .then(data => {
        assert.equal(data.version,"1.0.0.2");
        fs.removeSync(path.join(__dirname,'testfiles/tmp.xml'));
        done();
      })
      .catch(err => {
        fs.removeSync(path.join(__dirname,'testfiles/tmp.xml'));
        done(err);
      });
    });
  });
  it('should fail with command line if manifest is missing',function(done) {
    var testCommand = "node " + path.join(__dirname,'../cmd/commandLine.js');
    exec(testCommand, (err,stdout,stderr) => {
      done(!err);
    });
  });
  it('should work with command line',function(done) {
    fs.copy(path.join(__dirname,'testfiles/valid.xml'),path.join(__dirname,'testfiles/tmp.xml'),function(err) {
      assert.ifError(err);
      var testCommand = "node " + path.join(__dirname,'../cmd/commandLine.js') + " " + path.join(__dirname,'testfiles/tmp.xml');
      exec(testCommand, (err,stdout,stderr) => {
        assert.ifError(err);
        versionUpdate.incrementVersionFile(path.join(__dirname,'testfiles/tmp.xml'),true)
        .then(data => {
          assert.equal(data.version,"1.0.0.2");
          fs.removeSync(path.join(__dirname,'testfiles/tmp.xml'));
          done();
        })
        .catch(err => {
          fs.removeSync(path.join(__dirname,'testfiles/tmp.xml'));
          done(err);
        });
      });
    });
  });
});
