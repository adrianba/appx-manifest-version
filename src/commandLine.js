#!/usr/bin/env Node

"use strict";

if(process.argv.length<3) {
  console.error("Usage: appx-version manifestPath");
  process.exit(1);
}

const path = require('path');
const fs   = require('fs');
const src  = path.dirname(fs.realpathSync(__filename));
const versionIncrement = require(src + "/index.js");

const manifestPath = process.argv[2];
versionIncrement.incrementVersionFile(manifestPath,true)
  .then(data => {
    console.log("appx-version: Updated " + manifestPath + " to " + data.version);
  })
  .catch(err => {
    console.error("appx-version: " + err.status);
    console.error(err.details);
    process.exit(1);
  });