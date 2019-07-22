const Base = require('./base');

const TYPE_MAPS = { 0: 'custom_monitor', 1: 'perf_monitor', 2: 'error_monitor' };

module.exports = class extends Base {
  async getAction() {
    let {
      site_id,
      start_time,
      end_time,
      type,
      metric_id,
      metrics = '',
    } = this.get();

    const metricItem = await this.model('metric').where({ id: metric_id }).find();
    if (!TYPE_MAPS[metricItem.type]) {
      return this.fail('metric type not valid');
    }

    this.modelInstance = this.model(TYPE_MAPS[metricItem.type]);
    let endTime = new Date(end_time);
    endTime = think.datetime(endTime.setDate(endTime.getDate() + 1), 'YYYY-MM-DD HH:mm');
    const where = { site_id, metric_id, create_time: { '>=': start_time, '<': endTime}  };
    
    let metrics_ary = [];
    let key = 'k1';
    if (metrics !== '') {
      metrics_ary = metrics.split(',');
      key = `k${metrics_ary.length + 1}`;
      for (let i = 0; i < metrics_ary.length; i++) {
        where[`k${i + 1}`] = metrics_ary[i];
      }
    }
    
    const data = await this.modelInstance.where(where).distinct(key).select();
    const factors = data.map(item => item[key])

    let series = [];
    let categories;
    switch (type) {
      case 'day':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        series = await Promise.all(factors.map(async factor => {
          const factorWhere = Object.assign({}, where, {[`k${metrics_ary.length + 1}`]: factor});
          const dataByFactor = await this.modelInstance.where(factorWhere).select();
          const seriesData = await this.getSeriesData(site_id, metric_id, dataByFactor, categories, type, factors);
          seriesData.name = factor;
          return seriesData;
        }));
        break;
      default:
        return this.success(await this.groupWithCustom(site_id, data, perfData => {
          let time = 0;
          let count = 0;
          for (let i = 0; i < perfData.length; i++) {
            time += perfData[i].time;
            count += perfData[i].count;
          }
          return this.avg({ time, count }, 0);
        }));
    }
    return this.success({ categories, series });
  }

  getSeriesData(site_id, metric_id, data, categories, type) {
    return this.groupWithCustom(site_id, metric_id, data, ({ data }) => {
      const result = {};
      for (let i = 0; i < data.length; i++) {
        const date = think.datetime(
          new Date(data[i].create_time),
          Base.BETWEEN[type].format
        );
        if (!result[date]) {
          result[date] = { time: 0, count: 0 };
        }
        result[date].time += data[i].time;
        result[date].count += data[i].count;
      }

      const output = [];
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        if (think.isEmpty(result[cat])) {
          output.push(null);
          continue;
        }

        output.push(this.avg(result[cat], 0));
      }

      return {
        data: output
      };
    });
  }

  async getDashBoardList() {
    // 
  }
};
