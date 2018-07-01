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
    const pageSize = 2500;

    for (const metric of metrics) {
      const tableName = 'perf_' + metric;
      const model = this.model(tableName);
      let page = 1;
      while (true) {
        // 分片删除避免一次性删除过多数据
        const {totalPages, data} = await model.where({
          create_time: ['<', twoMonthAgo]
        }).page(page, pageSize)
          .field('id')
          .countSelect();

        if (think.isEmpty(data)) {
          break;
        }

        await model.where({id: ['IN', data.map(({id}) => id)]}).delete();

        if (totalPages === page) {
          break;
        } else {
          page += 1;
        }
      }
      think.logger.info(`清除 ${twoMonthAgo} 之前的 ${tableName} 老数据成功`);
    }

    return this.success();
  }
};
