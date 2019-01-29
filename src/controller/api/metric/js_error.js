const Base = require('./base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('js_error');
  }

  async getAction() {
    const {
      site_id,
      site_page_id,
      start_time,
      end_time
    } = this.get();

    const where = { site_id, create_time: { '>=': start_time, '<': end_time } };
    if (site_page_id) { where.site_page_id = site_page_id }

    const data = await this.modelInstance
      .where(where)
      .order('create_time DESC')
      .select();

    const categories = this.generateCates(start_time, end_time, 'mins');
    const series = {};
    const total = {};

    for (let i = 0; i < data.length; i++) {
      const { error, count, create_time } = data[i];
      const time = think.datetime(create_time, 'MM-DD HH:mm');
      if (!series[error]) {
        series[error] = {};
      }
      if (!series[error][time]) {
        series[error][time] = 0;
      }
      if (!total[time]) {
        total[time] = 0;
      }

      series[error][time] += count;
      total[time] = 0;
    }
    series.Total = total;
    const result = [];
    for (const k in series) {
      result.push({
        name: k,
        data: categories.map(cate => series[k][cate])
      });
    }
    return this.success({ categories, series: result });
  }

  postAction() {
    return this.dataCollection('js_error');
  }
};
