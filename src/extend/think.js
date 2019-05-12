const path = require('path');
const preventMessage = 'PREVENT_NEXT_PROCESS';

module.exports = {
  prevent() {
    throw new Error(preventMessage);
  },
  isPrevent(err) {
    return think.isError(err) && err.message === preventMessage;
  },
  RUNTIME_PATH: path.join(think.ROOT_PATH, 'runtime'),
  RESOURCE_PATH: path.join(think.ROOT_PATH, 'www')
};
