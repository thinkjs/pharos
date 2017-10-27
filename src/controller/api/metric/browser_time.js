const Base = require('./base');
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
      create_time: {'>=': start_time, '<': end_time}
    };
    if (perf) { where.perf = global.perfs[perf] }
    if (site_page_id) { where.site_page_id = site_page_id }

    const data = await this.modelInstance.where(where).select();

    if (where.perf !== undefined) {
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
        y: this.avg(series[browser])
      }));
      drillSeries = Object.keys(drillSeries).map(browser => {
        return {
          name: browser,
          id: browser,
          data: Object.keys(drillSeries[browser]).map(version => {
            return [version, this.avg(drillSeries[browser][version])];
          })
        };
      });
      return this.success({series, drilldown: {series: drillSeries}});
    }

    let series = {};
    const categories = [];
    for (let i = 0; i < data.length; i++) {
      const {perf, browser, time, count} = data[i];
      if (!categories[browser]) {
        categories.push(browser);
        categories[browser] = categories.length - 1;
      }

      const perfName = global.perfs[perf];
      if (!Array.isArray(series[perfName])) {
        series[perfName] = Array.from(
          {length: global.perfs.length},
          () => ({time: 0, count: 0})
        );
      }

      const perfIndex = categories[browser];
      series[perfName][perfIndex].time += time;
      series[perfName][perfIndex].count += count;
    }

    series = Object.keys(series).map(perf => ({
      name: perf,
      data: series[perf].map(serie => this.avg(serie))
    }));
    return this.success({categories, series});
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
