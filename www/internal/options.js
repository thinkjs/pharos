var argv = require('minimist')(process.argv.slice(2));
var {
  NODE_ENV = 'development', env = 'development', devtool, uglify, autoUpdate = false
} = argv;

const supportedEnvs = ['development', 'test', 'beta', 'production'];
const supportedNodeEnvs = ['development', 'production'];
if (!supportedEnvs.includes(env)) {
  throw new Error('env must be one of the following values: ' + supportedEnvs.join(', '));
}
if (!supportedNodeEnvs.includes(NODE_ENV)) {
  throw new Error('NODE_ENV must be one of the following values: ' + supportedNodeEnvs.join(', '));
}

process.env.NODE_ENV = NODE_ENV;

if (uglify === undefined) {
  uglify = NODE_ENV === 'production';
}
if (devtool === undefined) {
  devtool = (NODE_ENV === 'production' ? 'source-map' : 'source-map');
}

const options = {
  NODE_ENV,
  env,
  devtool,
  uglify,
  autoUpdate
};
module.exports = options
