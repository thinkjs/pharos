const Base = require('./base');

think.messenger.on('browser_time', () => {
  const data = global.PHAROS_DATA.browser_time;
  delete global.PHAROS_DATA.browser_time;
  return data;
});

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('perf_browser_time');
  }

  async getAction() {
    const {
      site_id,
      site_page_id,
      start_time,
      end_time,
      perf
    } = this.get();
    const where = {
      site_id,
      perf: global.perfs[perf],
      create_time: {'>=': start_time, '<': end_time}
    };
    if (site_page_id) { where.site_page_id = site_page_id }

    const data = await this.modelInstance.where(where).select();
    if (think.isEmpty(data)) {
      return this.fail();
    }

    let series = {};
    let drillSeries = {};
    for (let i = 0; i < data.length; i++) {
      const {browser, version, time, count} = data[i];
      if (!series[browser]) {
        series[browser] = {time: 0, count: 0};
      }
      if (!drillSeries[browser]) {
        drillSeries[browser] = {};
      }
      if (!drillSeries[browser][version]) {
        drillSeries[browser][version] = {time: 0, count: 0};
      }
      series[browser].time += time;
      series[browser].count += count;
      drillSeries[browser][version].time += time;
      drillSeries[browser][version].count += 1;
    }
    series = Object.keys(series).map(browser => ({
      name: browser,
      drilldown: browser,
      y: Math.round(series[browser].time / series[browser].count * 100) / 100
    }));
    drillSeries = Object.keys(drillSeries).map(browser => {
      return {
        name: browser,
        id: browser,
        data: Object.keys(drillSeries[browser]).map(version => {
          const {time, count} = drillSeries[browser][version];
          return [version, Math.round(time / count * 100) / 100];
        })
      };
    });
    return this.success({series, drilldown: {series: drillSeries}});
  }

  async postAction() {
    const startTime = Date.now();
    const createTime = think.datetime(Date.now(), 'YYYY-MM-DD HH:mm:00');
    think.logger.info('crontab', 'browser_time', createTime);
    const arr = this.map(
      await think.messenger.map('browser_time'),
      ['site_id', 'site_page_id', 'perf', 'browser', 'version'],
      item => {
        item.create_time = createTime;
      }
    );

    if (think.isEmpty(arr)) {
      return think.logger.warn('browser_time is empty');
    }
    await this.modelInstance.addMany(arr);
    think.logger.info(`browser_time crontab time: ${Date.now() - startTime}ms`);
    return this.success();
  }
};
