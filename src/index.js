"use strict";

const fs = require('fs');
const xml2js = require('xml2js');

module.exports = {
  incrementVersion : function(manifestPath) {
    return new Promise((resolve,reject) => {
      fs.readFile(manifestPath,'utf8',function (err,res) {
        if(err) {
          reject({status:"readerror",details:err});
          return;
        }

        // Got file contents - now parse as XML
        xml2js.parseString(res,{explicitArray:false},function(err,data) {
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
            data.Package.Identity['$'].Version = "9.9.9.9";

            // Return updated XML
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(data);
            resolve(xml);
          }
        });
      });
    });
  }
};