const Base = require('./base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('perf_os_time');
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
        const {os, version, time, count} = data[i];
        if (!series[os]) {
          series[os] = {time: 0, count: 0};
        }
        if (!drillSeries[os]) {
          drillSeries[os] = {};
        }
        if (!drillSeries[os][version]) {
          drillSeries[os][version] = {time: 0, count: 0};
        }
        series[os].time += time;
        series[os].count += count;
        drillSeries[os][version].time += time;
        drillSeries[os][version].count += 1;
      }
      series = Object.keys(series).map(os => ({
        name: os,
        drilldown: os,
        y: this.avg(series[os])
      }));
      drillSeries = Object.keys(drillSeries).map(os => {
        return {
          name: os,
          id: os,
          data: Object.keys(drillSeries[os]).map(version => {
            return [version, this.avg(drillSeries[os][version])];
          })
        };
      });
      return this.success({series, drilldown: {series: drillSeries}});
    }

    let series = {};
    const categories = [];
    for (let i = 0; i < data.length; i++) {
      const {perf, os, time, count} = data[i];
      if (!categories[os]) {
        categories.push(os);
        categories[os] = categories.length - 1;
      }

      const perfName = global.perfs[perf];
      if (!Array.isArray(series[perfName])) {
        series[perfName] = Array.from(
          {length: global.perfs.length},
          () => ({time: 0, count: 0})
        );
      }

      const perfIndex = categories[os];
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
    think.logger.info('crontab', 'os_time', createTime);
    const arr = this.map(
      await think.messenger.map('os_time'),
      ['site_id', 'site_page_id', 'perf', 'os', 'version'],
      item => {
        item.create_time = createTime;
      }
    );

    if (think.isEmpty(arr)) {
      return think.logger.warn('os_time is empty');
    }
    await this.modelInstance.addMany(arr);
    think.logger.info(`os_time crontab time: ${Date.now() - startTime}ms`);
    return this.success();
  }
};
