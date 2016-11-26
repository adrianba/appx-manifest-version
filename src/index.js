"use strict";

const fs = require('fs');
const xml2js = require('xml2js');

function increment(versionString) {
  const regex = /(.*\.)([0-9]+)$/;
  var match = regex.exec(versionString);
  if(!match) return undefined;
  return match[1] + (parseInt(match[2]) + 1);
}

function incrementVersion(manifestString) {
  return new Promise((resolve,reject) => {
    // Got file contents - now parse as XML
    xml2js.parseString(manifestString, {explicitArray:false}, function(err,data) {
      if(err) {
        reject({status:"xmlerror",details:err});
        return;
      }

      // Got XML as JSON object - find version and update
      if(!data) {
        reject({status:"xmlerror",details:"No XML content found"});
      } else if(!data.Package) {
        reject({status:"formaterror",details:"Missing Package node"});
      } else if(!data.Package.Identity) {
        reject({status:"formaterror",details:"Missing Identity node"});
      } else if(!data.Package.Identity['$'] || !data.Package.Identity['$'].Version) {
        reject({status:"formaterror",details:"Missing Version attribute node"});
      } else {
        // Data is valid - now increment version
        var newVer = increment(data.Package.Identity['$'].Version);
        if(!newVer) {
          reject({status:"versionerror",details:"Failed to match version number pattern"});
        } else {
          data.Package.Identity['$'].Version = newVer;

          // Return updated XML
          var builder = new xml2js.Builder();
          var xml = builder.buildObject(data);
          resolve({version:newVer, manifest:xml});
        }
      }
    });
  });
}

function incrementVersionFile(manifestPath,overwriteOriginal) {
  return new Promise((resolve,reject) => {
    fs.readFile(manifestPath,'utf8',function (err,res) {
      if(err) {
        reject({status:"readerror",details:err});
      } else {
        incrementVersion(res)
          .then(r => {
            if(overwriteOriginal) {
              // Need to write out the new manifest over the old one
              fs.writeFile(manifestPath,r.manifest,"utf8",function(err) {
                if(err) {
                  reject({status:"writeerror",details:"Unable to write new manifest"});
                } else {
                  resolve(r);
                }
              });
            } else {
              resolve(r);
            }
          })
          .catch(e => { reject(e); });
      }
    });
  });
}

module.exports = {
  incrementVersion,
  incrementVersionFile
};