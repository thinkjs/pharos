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
      metric_id,
      metric = 'k1',
    } = this.get();
    const where = { site_id, create_time: { '>=': start_time, '<': end_time } };

    const data = await this.modelInstance.where(where).select();
    let series;
    let categories;
    switch (type) {
      // case 'day':
      // case 'hour':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        series = await this.groupWithCustom(site_id, metric_id, metric, data, customData => {
          const result = {
            data: []
          };
          result.name = customData.name;
          categories.map(cat => {
            customData.data.map(item => {
              if (item.create_time.includes(cat)) {
                result.data.push(item[metric]);
              } else {
                result.data.push(null);
              }
            })
          })
          return result;
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
    return this.success({ categories, series });
  }
};
