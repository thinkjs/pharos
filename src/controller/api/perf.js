const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  constructor(...args) {
    super(...args);
    this.modelPerf = this.model('performance');
    this.modelArch = this.model('performance_archive');
  }

  async getAction() {
    const {metric} = this.get();
    if (typeof this[`get${metric}`] === 'function') {
      return this[`get${metric}`]();
    }
    return this.success();
  }

  /** 某 site_id 某 site_page_id 所有 perf 因素某段日期的平均时间 */
  async getallPerfAvgConsumeTime() {
    const {site_id, site_page_id, start_time, end_time} = this.get();

    const PERFS = ['loadPage', 'domReady', 'redirect', 'lookupDomain', 'ttfb', 'request', 'loadEvent', 'appcache', 'unloadEvent', 'connect'];
    const where = {site_id, start_time, end_time};
    // eslint-disable-next-line camelcase
    if (site_page_id) { where.site_page_id = site_page_id }
    let data = await this.modelArch.where(
      Object.assign({}, where, {index_name: ['IN', PERFS]})
    ).field('index_name as perf_name, index_value as perf_value').select();
    if (data.length === PERFS.length) {
      return this.success(data);
    }

    const sql = `SELECT 
      ${PERFS.map(perf => `AVG(${perf}) AS ${perf}`).join()} 
    FROM ph_performance
    WHERE 
      site_id=${site_id} AND 
      create_time>="${start_time}" AND 
      create_time<="${end_time}"
      ${site_page_id ? ` AND site_page_id=${site_page_id}` : ''}
    `;
    data = await this.modelPerf.query(sql);
    if (think.isEmpty(data)) {
      return this.success(PERFS.map(perf => ({perf_name: perf, perf_value: null})));
    }

    data = PERFS.map(perf => ({
      site_id,
      site_page_id,
      index_name: perf,
      index_value: data[0][perf],
      index_count: 0,
      start_time: start_time,
      end_time: end_time,
      archive_time: think.datetime()
    }));
    await this.modelArch.addMany(data);
    return this.success(data);
  }
};
