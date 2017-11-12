const Base = require('./base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('perf_region_time');
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
    const result = {};
    for (let i = 0; i < data.length; i++) {
      const {region, time, count} = data[i];
      if (!result[region]) {
        result[region] = {time: 0, count: 0};
      }

      result[region].time += time;
      result[region].count += count;
    }

    for (const region in result) {
      result[region] = this.avg(result[region]);
    }
    return this.success(result);
  }

  async postAction() {
    const startTime = Date.now();
    const createTime = think.datetime(Date.now(), 'YYYY-MM-DD HH:mm:00');
    think.logger.info('crontab', 'region_time', createTime);

    const gatherData = await think.messenger.map('region_time');
    const gatherKeys = ['site_id', 'site_page_id', 'perf', 'country', 'region', 'city'];
    const arr = this.map(gatherData, gatherKeys, item => { item.create_time = createTime });
    if (think.isEmpty(arr)) {
      return think.logger.warn('region_time is empty');
    }
    await this.addData(arr, ['create_time', ...gatherKeys]);

    think.logger.info(`region_time crontab time: ${Date.now() - startTime}ms`);
    return this.success();
  }
};
