const Base = require('./base');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('custom_monitor');
  }

  async getAction() {
    const {
      site_id,
      start_time,
      end_time,
      type,
      // metric_ids,
      metric = 'k1',
    } = this.get();
    const data = await this.model('metric').where({site_id}).select();
    const metric_ids = data.map(item => item.id).join(',');
    const metric_names = data.map(item => item.name);
    const metric_ids_ary = metric_ids.split(',');
    const result = await Promise.all(metric_ids_ary.map(async (metric_id, i) => this.getCustomData(
      site_id,
      metric_id,
      start_time,
      end_time,
      type,
      metric,
      metric_names[i]
    )));
    return this.success(result);
  }

  async getCustomData(site_id, metric_id, start_time, end_time, type, metric, metric_name) {
    const where = { site_id, metric_id, create_time: { '>=': start_time, '<': end_time } };

    const data = await this.modelInstance.where(where).select();
    let factors = await this.getFactors(metric_id);
    let series;
    let categories;
    switch (type) {
      case 'day':
        categories = this.generateCates(start_time, end_time, type);
        series = await this.groupWithCustom(site_id, metric_id, metric, data, customData => {
          const map = new Map();
          for(let i = 0; i < customData.data.length; i++) {
              const create_time = customData.data[i].create_time.split(' ')[0];
              if (map.has(create_time)) {
                  map.set(create_time, (+map.get(create_time)) + (+customData.data[i][metric]));
              } else {
                  map.set(create_time, (+customData.data[i][metric]));
              }
          }
          const addedData = map;          
          const result = {
            data: []
          };
          result.name = customData.name;
          result.data = new Array(categories.length).fill(null);
          categories.map((cat, index) => {
            for(let item of addedData.entries()) {
              if (item[0].includes(cat)) {
                result.data[index] = item[1];
              }
            }
          })
          return [result];
        });
        break;
      // case 'hour':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        series = await this.groupWithCustom(site_id, metric_id, metric, data, customData => {
          const result = {
            data: []
          };
          result.name = customData.name;
          result.data = new Array(categories.length).fill(null);
          categories.map((cat, index) => {
            customData.data.map(item => {
              if (item.create_time.includes(cat)) {
                result.data[index] = +item[metric];
              }
            })
          })
          return [result];
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
    return { categories, series, factors, metric_id, metric_name };
  }
};
