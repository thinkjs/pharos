const Base = require('../base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('alarm');
  }

  async getAction() {
    const { site_id, page, pagesize } = this.get();

    const modelConfig = this.config('model');
    const { prefix } = modelConfig[modelConfig.type];

    const logs = await this.modelInstance.join({
      table: 'metric',
      join: 'left',
      on: ['metric_id', 'id'],
    }).where({ [`${prefix}alarm.site_id`]: site_id }).page(page, pagesize).countSelect();

    return this.success(logs);
  }
};
