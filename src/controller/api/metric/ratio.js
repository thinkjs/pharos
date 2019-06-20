const Base = require('./base');

const TYPE_MAPS = { 0: 'custom_monitor', 1: 'perf_monitor', 2: 'error_monitor' };

module.exports = class extends Base {
  async getAction() {
    let {
      site_id,
      metric_id,
    } = this.get();

    const metricItem = await this.model('metric').where({ id: metric_id }).find();
    this.metric_name = metricItem.name;
    if (!TYPE_MAPS[metricItem.type]) {
      return this.fail('metric type not valid');
    }

    this.modelInstance = this.model(TYPE_MAPS[metricItem.type]);

    const time = {
        today_start_time: think.datetime(new Date(), 'YYYY-MM-DD'),
        today_end_time: think.datetime(new Date().setDate(new Date().getDate() + 1), 'YYYY-MM-DD'),
        yesterday_start_time: think.datetime(new Date().setDate(new Date().getDate() - 1), 'YYYY-MM-DD'),
        yesterday_end_time: think.datetime(new Date(), 'YYYY-MM-DD'),
        this_week_start_time: think.datetime(new Date().setDate(new Date().getDate() - 6), 'YYYY-MM-DD'),
        this_week_end_time: think.datetime(new Date(), 'YYYY-MM-DD'),
        last_week_start_time: think.datetime(new Date().setDate(new Date().getDate() - 13), 'YYYY-MM-DD'),
        last_week_end_time: think.datetime(new Date().setDate(new Date().getDate() - 7), 'YYYY-MM-DD'),
    }

    return this.success({
        today: await this.getRatioData(site_id, metric_id, time.today_start_time, time.today_end_time, 'mins'),
        yesterday: await this.getRatioData(site_id, metric_id, time.yesterday_start_time, time.yesterday_end_time, 'mins'),
        this_week: await  this.getRatioData(site_id, metric_id, time.this_week_start_time, time.this_week_end_time, 'day'),
        last_week: await  this.getRatioData(site_id, metric_id, time.last_week_start_time, time.last_week_end_time, 'day'),
    });

  }

  async getRatioData(site_id, metric_id, start_time, end_time, type) {
    let endTime = new Date(end_time);
    endTime = think.datetime(endTime.setDate(endTime.getDate() + 1), 'YYYY-MM-DD');
    const where = { site_id, metric_id, create_time: { '>=': start_time, '<': endTime}  };
    
    const data = await this.modelInstance.where(where).select();

    let series = [];
    let categories;
    switch (type) {
      case 'day':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        const ratioData = {
            data: await this.getSeriesData(site_id, metric_id, data, categories, type),
            name: this.metric_name,
        }
        series = [ratioData];
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
    return { categories, series };
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

      return output
    });
  }
};
