const Base = require('./base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('js_error');
  }

  async getAction() {
  }

  postAction() {
    return this.dataCollection('js_error');
  }
};
