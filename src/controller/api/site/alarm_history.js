const Base = require('../base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('alarm');
  }

  async getAction() {
    const { site_id, page, pagesize } = this.get();
    const result = await this.modelInstance.where({site_id: site_id}).page([page, pagesize]).countSelect();
    return this.success(result);
  }
};
