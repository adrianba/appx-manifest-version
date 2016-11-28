# appx-manifest-version

[![Build Status](https://travis-ci.org/adrianba/appx-manifest-version.svg?branch=master)](https://travis-ci.org/adrianba/appx-manifest-version)
[![Coverage Status](https://coveralls.io/repos/github/adrianba/appx-manifest-version/badge.svg)](https://coveralls.io/github/adrianba/appx-manifest-version)
[![Dependency Status](https://david-dm.org/adrianba/appx-manifest-version.svg)](https://david-dm.org/adrianba/appx-manifest-version)

Tool used to increment the version number of an `AppxManifest.xml` file.

## Installation

The package is published to [npmjs.com](https://www.npmjs.com/package/appx-manifest-version).
You can install with:

    npm install -g appx-manifest-version

or

    npm install appx-manifest-version --save-dev

## Command Line

    appx-version manifest_file_path

This will load the Appx manifest XML file `manifest_file_path`, locate
the `Package/Identity@Version` field and increment the final numerical
field after a period (`.`). Then it will overwrite the original manifest
file with the updated content.

## Code

You can call into the `appx-manifest-version` module from your own code
as follows:

```javascript
const appxVersion = require('appx-manifest-version');

// currentManifestString is a string containing the manifest contents
// returns a Promise
appxVersion.incrementVersion(currentManifestString)
  .then(data => {
    console.log(data.version);  // new version string
    console.log(data.manifest); // new manifest string
  })
  .catch(err => {
    console.error(err.status);  // error code
    console.error(err.details); // error details string
  });

// manifestPath is the path to the manifest XML file
// overwriteCurrent is true if the current XML file should be updated
// returns a Promise
appxVersion.incrementVersionFile(manifestPath,overwriteCurrent)
  .then(data => {
    console.log(data.version);  // new version string
    console.log(data.manifest); // new manifest string
  })
  .catch(err => {
    console.error(err.status);  // error code
    console.error(err.details); // error details string
  });
```

## License

See the [LICENSE](LICENSE) file.