const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports = class extends think.Controller {
  async cleanAction() {
    const metricPath = path.join(think.ROOT_PATH, 'src/controller/api/metric');
    const metrics = fs.readdirSync(metricPath)
      .filter(name => name !== 'base.js')
      .map(name => name.split('.js')[0]);

    // eslint-disable-next-line
    console.log(`当前共有监控项：${metrics.join()}`);

    const twoMonthAgo = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    const pageSize = 2500;

    // eslint-disable-next-line
    console.log(`准备清理 ${twoMonthAgo} 之前的数据`);

    for (const metric of metrics) {
      // eslint-disable-next-line
      console.log(`====开始清理 ${metric} 监控项数据====`);

      const tableName = 'perf_' + metric;
      const model = this.model(tableName);
      const metricTotalCounts = await model.where({
        create_time: ['<', twoMonthAgo]
      }).count('id');
      let metricTotalPages = Math.ceil(metricTotalCounts / pageSize);
      while (metricTotalPages) {
        // 分片删除避免一次性删除过多数据
        const data = await model.where({
          create_time: ['<', twoMonthAgo]
        }).page(1, pageSize).field('id').select();
        if (think.isEmpty(data)) {
          break;
        }

        metricTotalPages -= 1;
        // think.logger.info(`${tableName} 还剩 ${totalPages} 页数据`);
        // eslint-disable-next-line
        console.log(`${tableName} 还剩 ${totalPages} 页数据`);
        await model.where({ id: ['IN', data.map(({ id }) => id)] }).delete();
      }

      // eslint-disable-next-line
      console.log(`====清除 ${twoMonthAgo} 之前的 ${metric} 老数据成功====`);
      // think.logger.info(`清除 ${twoMonthAgo} 之前的 ${tableName} 老数据成功`);
    }

    return this.success();
  }
};
