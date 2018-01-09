const Base = require('./base');

const FIVE_MINS = 5 * 60 * 1000;
const ONE_HOUR = FIVE_MINS * 12;
const ONE_DAY = ONE_HOUR * 24;
const BETWEEN = {
  day: {
    delta: ONE_DAY,
    format: 'YYYY-MM-DD',
    transform: 'YYYY-MM-DD 00:00:00'
  },
  hour: {
    delta: ONE_HOUR,
    format: 'MM-DD HH:00',
    transform: 'YYYY-MM-DD HH:00:00'
  },
  mins: {
    delta: FIVE_MINS,
    format: 'MM-DD HH:mm',
    transform: 'YYYY-MM-DD HH:mm:00'
  }
};

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
    let series;
    let categories;
    switch (type) {
      case 'interval':
        categories = global.section.map(section => section[1]);
        series = await this.groupWithPerf(
          site_id,
          data,
          perfData => {
            const result = {};
            for (let i = 0; i < perfData.length; i++) {
              const section = perfData[i].section;
              if (!result[section]) {
                result[section] = 0;
              }
              result[section] += perfData[i].count;
            }

            let total = 0;
            for (const section in result) {
              total += result[section];
            }

            const output = [];
            for (let i = 0; i < categories.length; i++) {
              output.push(this.avg({time: result[i], count: total}, 3));
            }
            return output;
          });
        break;
      case 'hour.interval':
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
        series = await this.groupWithPerf(
          site_id,
          data,
          perfData => {
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
              result[hour] = this.avg(result[hour], 0);
            }

            const output = [];
            for (let i = 0; i < categories.length; i++) {
              output.push(result[i]);
            }
            return output;
          });
        break;
      case 'day':
      case 'hour':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        series = await this.groupWithPerf(
          site_id,
          data,
          perfData => {
            const result = {};
            for (let i = 0; i < perfData.length; i++) {
              const date = think.datetime(
                new Date(perfData[i].create_time),
                BETWEEN[type].format
              );
              if (!result[date]) {
                result[date] = {time: 0, count: 0};
              }
              result[date].time += perfData[i].time;
              result[date].count += perfData[i].count;
            }

            for (const day in result) {
              result[day] = this.avg(result[day], 0);
            }

            const output = [];
            for (let i = 0; i < categories.length; i++) {
              output.push(result[categories[i]]);
            }
            return output;
          });
        break;
      default:
        return this.success(await this.groupWithPerf(site_id, data, perfData => {
          let time = 0;
          let count = 0;
          for (let i = 0; i < perfData.length; i++) {
            time += perfData[i].time;
            count += perfData[i].count;
          }
          return this.avg({time, count}, 0);
        }));
    }
    return this.success({categories, series});
  }

  postAction() {
    return this.dataCollection(
      'consume_time',
      ['site_id', 'site_page_id', 'perf', 'section']
    );
  }

  generateCates(start_time, end_time, type = 'day') {
    const {delta, format, transform} = BETWEEN[type] || BETWEEN['day'];
    const startTime = new Date(think.datetime(new Date(start_time), transform)).getTime();
    const endTime = new Date(think.datetime(new Date(end_time), transform)).getTime();

    const times = [];
    for (let time = startTime; time < endTime; time += delta) {
      times.push(think.datetime(new Date(time), format));
    }
    return times;
  }
};
