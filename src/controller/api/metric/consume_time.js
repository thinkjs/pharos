const Base = require('./base');

think.messenger.on('consume_time', () => {
  const data = global.PHAROS_DATA.consume_time;
  delete global.PHAROS_DATA.consume_time;
  return data;
});

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('perf_consume_time');
  }

  async getAction() {
    const {
      site_id,
      site_page_id,
      start_time,
      end_time,
      type
    } = this.get();
    const where = {site_id, create_time: {'>=': start_time, '<': end_time}};
    if (site_page_id) { where.site_page_id = site_page_id }

    const data = await this.modelInstance.where(where).select();
    if (think.isEmpty(data)) {
      return this.fail();
    }

    let series;
    let categories;
    switch (type) {
      case 'interval':
        categories = global.interval.map(interval => interval[1]);
        series = this.groupWithPerf(data, perfData => {
          const result = {};
          for (let i = 0; i < perfData.length; i++) {
            const interval = perfData[i].interval;
            if (!result[interval]) {
              result[interval] = 0;
            }
            result[interval] += perfData[i].count;
          }

          let total = 0;
          for (const interval in result) {
            total += result[interval];
          }

          const output = [];
          for (let i = 0; i < categories.length; i++) {
            output.push(Math.round(result[i] / total * 1000) / 1000);
          }
          return output;
        });
        break;
      case 'hour':
        categories = [
          '0-1点',
          '1-2点',
          '2-3点',
          '3-4点',
          '4-5点',
          '5-6点',
          '6-7点',
          '7-8点',
          '8-9点',
          '9-10点',
          '10-11点',
          '11-12点',
          '12-13点',
          '13-14点',
          '14-15点',
          '15-16点',
          '16-17点',
          '17-18点',
          '18-19点',
          '19-20点',
          '20-21点',
          '21-22点',
          '22-23点',
          '23-24点'
        ];
        series = this.groupWithPerf(data, perfData => {
          const result = {};
          for (let i = 0; i < perfData.length; i++) {
            const hour = parseInt(
              think.datetime(new Date(perfData[i].create_time), 'HH')
            );
            if (!result[hour]) {
              result[hour] = {time: 0, count: 0};
            }
            result[hour].time += perfData[i].time;
            result[hour].count += perfData[i].count;
          }

          for (const hour in result) {
            const {time, count} = result[hour];
            result[hour] = Math.round(time / count);
          }

          const output = [];
          for (let i = 0; i < categories.length; i++) {
            output.push(result[i]);
          }
          return output;
        });
        break;
      case 'day':
        categories = this.generateDayCates(start_time, end_time);
        series = this.groupWithPerf(data, perfData => {
          const result = {};
          for (let i = 0; i < perfData.length; i++) {
            const day = think.datetime(new Date(perfData[i].create_time), 'YYYY-MM-DD');
            if (!result[day]) {
              result[day] = {time: 0, count: 0};
            }
            result[day].time += perfData[i].time;
            result[day].count += perfData[i].count;
          }

          for (const day in result) {
            const {time, count} = result[day];
            result[day] = Math.round(time / count);
          }

          const output = [];
          for (let i = 0; i < categories.length; i++) {
            output.push(result[categories[i]]);
          }
          return output;
        });
        break;
      default:
        return this.success(this.groupWithPerf(data, perfData => {
          let time = 0;
          let count = 0;
          for (let i = 0; i < perfData.length; i++) {
            time += perfData[i].time;
            count += perfData[i].count;
          }
          return Math.round(time / count);
        }));
    }
    return this.success({categories, series});
  }

  async postAction() {
    const startTime = Date.now();
    const createTime = think.datetime(Date.now(), 'YYYY-MM-DD HH:mm:00');
    think.logger.info('crontab', 'consume_time', createTime);
    const arr = this.map(
      await think.messenger.map('consume_time'),
      ['site_id', 'site_page_id', 'perf', 'interval'],
      item => {
        item.create_time = createTime;
      }
    );

    if (think.isEmpty(arr)) return this.fail();
    await this.modelInstance.addMany(arr);
    think.logger.info(`consume_time crontab time: ${Date.now() - startTime}ms`);
    return this.success();
  }

  map(arr, keys, fn = _ => {}) {
    const result = [];
    function mapFilter(obj, keys, info = {}, fn) {
      if (keys.length) {
        for (const i in obj) {
          info[keys[0]] = i;
          mapFilter(obj[i], keys.slice(1), info, fn);
        }
      } else {
        const data = {...info, ...obj};
        if (fn(data) === false) {
          return;
        };
        result.push(data);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      mapFilter(arr[i], keys, {}, fn);
    }
    return result;
  }

  groupWithPerf(data, cb) {
    const result = {};
    for (let i = 0; i < data.length; i++) {
      const perf = global.perfs[data[i].perf];
      if (!Array.isArray(result[perf])) {
        result[perf] = [];
      }
      result[perf].push(data[i]);
    }

    const output = [];
    for (const perf in result) {
      output.push({
        name: perf,
        data: cb(result[perf])
      });
    }

    return output;
  }

  generateDayCates(start_time, end_time) {
    const startTime = new Date(think.datetime(new Date(start_time), 'YYYY-MM-DD 00:00:00')).getTime();
    const endTime = new Date(think.datetime(new Date(end_time), 'YYYY-MM-DD 00:00:00')).getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const days = [];

    for (let time = startTime; time <= endTime; time += ONE_DAY) {
      days.push(think.datetime(new Date(time), 'YYYY-MM-DD'));
    }
    return days;
  }
};
