const Base = require('./base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.modelInstance = this.model('error_monitor');
    }
    async getAction() {
      const {
        site_id,
        metric_id,
      } = this.get();
      
      const data = await this.modelInstance.query('SELECT `k1` as "errmsg", SUM(count) as count FROM `ph_error_monitor` WHERE (`site_id` = ' + site_id + ' AND `metric_id` = ' + metric_id + ') GROUP BY `k1`');

      return this.success(data);
    }
};
