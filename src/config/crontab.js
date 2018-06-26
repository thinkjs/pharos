const filesize = require('filesize');

const metrics = [
  'consume_time',
  'browser_time',
  'os_time',
  'region_time'
];

metrics.forEach(metric => think.messenger.on(metric, () => {
  const data = global.PHAROS_DATA[metric];
  delete global.PHAROS_DATA[metric];
  return data;
}));

const tasks = metrics.map(metric => ({
  cron: '*/5 * * * *',
  handle: `api/metric/${metric}?_method=post`,
  type: 'one'
}));

tasks.push({
  type: 'all',
  interval: 1 * 60 * 1000,
  handle() {
    const useage = {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    for (const name in useage) {
      const arr = [];
      for (const i in useage[name]) {
        arr.push(`${i}:${filesize(useage[name][i])}`);
      }
      think.logger.info(`${name} - ${arr.join(', ')}`);
    }
  }
});

// 清理线上老数据
tasks.push({
  type: 'one',
  cron: '* * 1 * *',
  handle: 'cron/clean'
});

module.exports = tasks;
