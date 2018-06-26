const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports = class extends think.Controller {
  async cleanAction() {
    const metricPath = path.join(think.ROOT_PATH, 'src/controller/api/metric');
    const metrics = fs.readdirSync(metricPath)
      .filter(name => name !== 'base.js')
      .map(name => name.split('.js')[0]);

    const twoMonthAgo = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    await metrics.map(async metric => this.model(metric).where({
      create_time: ['<', twoMonthAgo]
    }).delete());
    think.logger.info(`清除 ${twoMonthAgo} 之前的老数据成功`);
    return this.success();
  }
};
