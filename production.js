const path = require('path');
const Application = require('thinkjs');

const instance = new Application({
  APP_PATH: path.join(__dirname, 'src'),
  ROOT_PATH: __dirname,
  proxy: true, // use proxy
  env: 'production'
});

instance.run();
