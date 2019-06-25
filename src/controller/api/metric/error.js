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

      const min1 = new Date().getMinutes().toString().charAt(0);
      const min2 = new Date().getMinutes().toString().charAt(1);

      const selectMin2 = min2 >= 5 ? 5 : 0;
      let selectMin = min1 + selectMin2.toString();
      const end_time = think.datetime(new Date().setMinutes(selectMin), 'YYYY-MM-DD HH:mm');
      const start_time = think.datetime(new Date().setMinutes(selectMin2 - 5), 'YYYY-MM-DD HH:mm');
      
      const data = await this.modelInstance.where({
        site_id,
        metric_id,
        create_time: { '>=': start_time, '<': end_time}
      }).field(['k1 as errmsg', 'SUM(count) as count']).group('k1').select();

      return this.success(data);
    }
};
