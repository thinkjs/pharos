var argv = require('minimist')(process.argv.slice(2));

var {
  env = 'development'
} = argv;

const supportedEnvs = ['development', 'test', 'beta', 'production'];
if (!supportedEnvs.includes(env)) {
  throw new Error('env must be one of the following values: ' + supportedEnvs.join(', '));
}

const options = {
  env,
};
module.exports = options
