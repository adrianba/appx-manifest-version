"use strict";

const assert = require("assert");
const path = require('path');

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
});
