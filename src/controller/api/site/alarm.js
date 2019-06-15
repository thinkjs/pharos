const Base = require('../base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('site_alarm');
  }

  async getAction() {
    const { site_id, page, pagesize } = this.get();
    const result = await this.modelInstance.where({site_id: site_id}).page([page, pagesize]).countSelect();
    return this.success(result);
  }

  __before() {
    this.post().conditions = JSON.stringify(this.post().conditions);
    return true;
  }

  async postAction() {
    const { site_id } = this.get();
    const { metric_id, name, conditions } = this.post();
    const result = await this.modelInstance.add({metric_id, site_id, name, conditions});
    return this.success(result);
  }

  async putAction() {
    const { name, conditions, metric_id } = this.post();
    const result = await this.modelInstance.where({id: this.id}).update({metric_id, name, conditions});
    return this.success(result);
  }

  async deleteAction() {
    const result = await this.modelInstance
        .where({id: this.id})
        .delete();
    return this.success(result);
  }
};
