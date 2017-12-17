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
    const perfs = await this.getPerfs(site_id);
    if (perf) { where.perf = perfs[perf] }
    if (site_page_id) { where.site_page_id = site_page_id }

    const data = await this.modelInstance.where(where).select();

    if (!think.isEmpty(where.perf)) {
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
      if (!think.isNumber(categories[os])) {
        categories.push(os);
        categories[os] = categories.length - 1;
      }

      const perfName = perfs[perf];
      if (!think.isArray(series[perfName])) {
        series[perfName] = Array.from(
          {length: categories.length},
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

  postAction() {
    return this.dataCollection(
      'os_time',
      ['site_id', 'site_page_id', 'perf', 'os', 'version']
    );
  }
};
