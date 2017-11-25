const Base = require('./base');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('options');
  }

  async getAction() {
    const {site_id} = this.get();
    const options = await this.modelInstance.getOptions(site_id);
    return this.success(options);
  }

  async postAction() {
    const {site_id, ...options} = this.post();
    const result = await this.modelInstance.updateOptions(options, null, site_id);
    this.success(result);
  }
};
