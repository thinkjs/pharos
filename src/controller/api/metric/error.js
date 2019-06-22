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

      const end_time = think.datetime(new Date(), 'YYYY-MM-DD HH:mm');
      const start_time = think.datetime(new Date().setMinutes(new Date().getMinutes() - 5), 'YYYY-MM-DD HH:mm');
      
      const data = await this.modelInstance.where({
        site_id,
        metric_id,
        create_time: { '>=': start_time, '<': end_time}
      }).field(['k1 as errmsg', 'SUM(count) as count']).group('k1').select();

      return this.success(data);
    }
};
