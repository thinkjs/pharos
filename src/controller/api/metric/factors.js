const Base = require('./base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.modelInstance = this.model('metric');
    }
    async getAction() {
      const {
        site_id,
        metric_id,
        metrics = '',
      } = this.get();

      const where = {site_id, id: metric_id};

      const metrics_ary = metrics.split(',');
      let key = 'k1';
      if (metrics !== '') {
        key = `k${metrics_ary.length + 1}`;
        for (let i = 0; i < metrics_ary.length; i++) {
          where[`k${i + 1}`] = metrics_ary[i];
        }
      }
      
      const data = await this.modelInstance.where(where).distinct(key).select();
      const result = data.map(item => item[key]);

      return this.success(result);
    }
};
