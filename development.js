const path = require('path');
const Application = require('thinkjs');
const watcher = require('think-watcher');

const instance = new Application({
  APP_PATH: path.join(__dirname, 'src'),
  ROOT_PATH: __dirname,
  watcher: watcher,
  env: 'development'
});

instance.run();
