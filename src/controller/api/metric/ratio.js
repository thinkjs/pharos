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
        last_week_start_time: think.datetime(new Date().setDate(new Date().getDate() - 7), 'YYYY-MM-DD'),
        last_week_end_time: think.datetime(new Date().setDate(new Date().getDate() - 6), 'YYYY-MM-DD'),
    }

    const today = await this.getRatioData(site_id, metric_id, time.today_start_time, time.today_end_time);
    const yesterday = await this.getRatioData(site_id, metric_id, time.yesterday_start_time, time.yesterday_end_time);
    const last_week = await  this.getRatioData(site_id, metric_id, time.last_week_start_time, time.last_week_end_time);

    const series = [today.series, yesterday.series, last_week.series];
    const categories = today.categories;

    return this.success({
      series,
      categories,
    });

  }

  async getRatioData(site_id, metric_id, start_time, end_time, type = 'mins') {
    const where = { site_id, metric_id, create_time: { '>=': start_time, '<': end_time}  };

    const data = await this.modelInstance.where(where).select();

    let series = [];
    const categories = this.generateCates(start_time, end_time, type);
    const ratioData = {
      data: await this.getSeriesData(site_id, metric_id, data, categories, type),
      name: start_time,
    }
    
    series = ratioData;
      const ratioCat = categories.map(item => item.split(' ')[1]);
      return { categories: ratioCat, series };
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
