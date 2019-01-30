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
      end_time,
      type
    } = this.get();

    const where = { site_id, create_time: { '>=': start_time, '<': end_time } };
    if (site_page_id) { where.site_page_id = site_page_id }

    const data = await this.modelInstance
      .where(where)
      .order('create_time DESC')
      .select();

    let categories;
    let series;

    switch (type) {
      case 'day':
      case 'day.hour':
      case 'day.mins':
        const days = this.generateCates(start_time, end_time, 'day');
        const cateFormat = type.split('.')[1] || 'mins';
        categories = this.generateCates(
          '2019-01-01 00:00:00',
          '2019-01-02 00:00:00',
          cateFormat,
          cateFormat === 'mins' ? 'HH:mm' : 'HH:00'
        );

        const _seriesDay = {};
        days.forEach(day => { _seriesDay[day] = {} });
        for (let i = 0; i < data.length; i++) {
          const { count, create_time } = data[i];
          const day = think.datetime(create_time, 'YYYY-MM-DD');
          const time = think.datetime(
            create_time,
            `HH:${cateFormat !== 'mins' ? '00' : 'mm'}`
          );
          if (!_seriesDay[day][time]) {
            _seriesDay[day][time] = 0;
          }
          _seriesDay[day][time] += count;
        }

        series = days.map(day => ({
          name: day,
          data: categories.map(cate => _seriesDay[day][cate])
        }));
        break;

      case 'hour':
      case 'mins':
        categories = this.generateCates(start_time, end_time, type);
        const _seriesMins = {};

        for (let i = 0; i < data.length; i++) {
          const { error, count, create_time } = data[i];
          const time = think.datetime(
            create_time,
            `MM-DD HH:${type !== 'mins' ? '00' : 'mm'}`
          );
          if (!_seriesMins[error]) {
            _seriesMins[error] = {};
          }
          if (!_seriesMins[error][time]) {
            _seriesMins[error][time] = 0;
          }
          _seriesMins[error][time] += count;
        }

        series = [];
        for (const k in _seriesMins) {
          series.push({
            name: k,
            data: categories.map(cate => _seriesMins[k][cate])
          });
        }
        break;
    }
    return this.success({ categories, series });
  }

  postAction() {
    return this.dataCollection('js_error');
  }
};
