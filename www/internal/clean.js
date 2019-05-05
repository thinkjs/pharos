const rimraf = require('rimraf');
rimraf('{public/client,dist,public/__version__}', {}, (e) => e && console.log(e))