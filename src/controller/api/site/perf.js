const Base = require('../base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('perf');
  }

  async getAction() {
    const {site_id} = this.get();
    const perfs = await this.modelInstance.where({site_id}).select();
    return this.success(perfs);
  }

  async postAction() {
    const {site_id} = this.get();
    const {name, description} = this.post();
    const result = await this.modelInstance
      .where({name, site_id})
      .thenAdd({site_id, name, description});
    return this.success(result);
  }

  async putAction() {
    if (!this.id) {
      return this.fail('MISS_ID');
    }

    const {name, description} = this.post();
    const data = {};
    if (name) { data.name = name }
    if (description) { data.description = description }
    const result = this.modelInstance
      .where({id: this.id})
      .update(data);
    return this.success(result);
  }
};
