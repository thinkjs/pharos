const Base = require('./base');

const TYPE_MAPS = { 0: 'custom_monitor', 1: 'perf_monitor', 2: 'error_monitor' };

module.exports = class extends Base {
  async getAction() {
    const {
      site_id,
      start_time,
      end_time,
      type,
      metric_id,
      metric,
    } = this.get();

    const metricItem = await this.model('metric').where({ id: metric_id }).find();
    if (!TYPE_MAPS[metricItem.type]) {
      return this.fail('metric type not valid');
    }

    this.modelInstance = this.model(TYPE_MAPS[metricItem.type]);
    const where = { site_id, metric_id, create_time: { '>=': start_time, '<': end_time } };

    const data = await this.modelInstance.where(where).select();
    let factors = await this.getFactors(metric_id);
    let series;
    let categories;
    switch (type) {
      case 'day':
      // categories = this.generateCates(start_time, end_time, type);
      // series = await this.groupWithCustom(site_id, metric_id, metric, data, customData => {
      //   const map = new Map();
      //   for (let i = 0; i < customData.data.length; i++) {
      //     const create_time = customData.data[i].create_time.split(' ')[0];
      //     if (map.has(create_time)) {
      //       map.set(create_time, (+map.get(create_time)) + (+customData.data[i][metric]));
      //     } else {
      //       map.set(create_time, (+customData.data[i][metric]));
      //     }
      //   }
      //   const addedData = map;
      //   const result = {
      //     data: []
      //   };
      //   result.name = customData.name;
      //   result.data = new Array(categories.length).fill(null);
      //   categories.map((cat, index) => {
      //     for (let item of addedData.entries()) {
      //       if (item[0].includes(cat)) {
      //         result.data[index] = item[1];
      //       }
      //     }
      //   })
      //   return [result];
      // });
      // break;
      // case 'hour':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        series = await this.groupWithCustom(site_id, metric_id, metric, data, ({ data, name }) => {
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
            name,
            data: output
          };
        });
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
    return this.success({ categories, series, factors, metric_id });
  }

  async getDashBoardList() {
    // 
  }
};
