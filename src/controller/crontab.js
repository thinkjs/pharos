const moment = require('moment');
const Base = require('./base.js');

const TYPE_MAPS = { 0: 'custome_monitor', 1: 'perf_monitor', 2: 'error_monitor' };
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.stats = {};
  }

  async __before() {
    const siteIds = await this.model('site')
      .field('id,sid,url')
      .where('1=1')
      .select();
    const metrics = await this.model('metric').where('1=1').select();

    const sites = {};
    this.metrics = {};
    for (const { id, sid, url } of siteIds) {
      sites[id] = {
        id,
        sid,
        url
      };
    }
    this.sites = sites;
    for (const metric of metrics) {
      const sid = sites[metric.site_id].sid;
      if (!think.isArray(this.metrics[sid])) {
        this.metrics[sid] = [];
      }
      this.metrics[sid].push(metric);
    }
  }

  async logstashAction() {
    think.logger.info('logstash ready');

    const { logFile, logFormat } = this.config();
    const now = moment();
    for (let i = 1; i <= 5; i++) {
      const file = logFile(now.subtract(i, 'minutes'));
      const parser = this.service('parser', logFormat);
      await parser.read(file, this.parseLog.bind(this));
    }

    for (const type in this.stats) {
      think.logger.info(`type=${type} update data length ${this.stats[type].length}`);

      if (!TYPE_MAPS[type]) {
        think.logger.warn(`type value ${type} is not valid.`);
        continue;
      }

      const modelInstance = this.model(TYPE_MAPS[type]);
      const shouldAdd = [];
      const shouldUpdate = [];
      const nowText = now.format('YYYY-MM-DD HH:mm:ss');
      const result = await modelInstance.where({
        create_time: nowText
      }).select();

      const records = {};
      for (const { id, site_id, k1, k2, k3, k4, k5, time, count } of result) {
        const k = [id, site_id, k1, k2, k3, k4, k5].filter(v => v).join('/');
        records[k] = { id, time, count };
      }

      for (const k in this.stats[type]) {
        if (!records[k]) {
          shouldAdd.push({
            ...this.stats[type][k],
            create_time: nowText
          });
          continue;
        }

        records[k].time += this.stats[type][k].time;
        records[k].count += this.stats[type][k].count;
        shouldUpdate.push(records[k]);
      }

      const ret = await modelInstance.updateMany(shouldUpdate);
      think.logger.info(`updateMany result ${ret}`);

      if (shouldAdd.length > 0) {
        const ret = await modelInstance.addMany(shouldAdd);
        think.logger.info(`addMany result ${ret}`);
      }
    }
    return this.success();
  }

  parseLog({ querystring: qs, pathname, http_referer }) {
    if (!pathname.includes('/pharos.gif')) {
      return;
    }
    const { site_id } = qs;
    if (http_referer && !http_referer.includes(sites[site_id].url)) {
      return;
    }

    const metrics = this.metrics[site_id];
    if (!think.isArray(metrics)) {
      return;
    }

    for (const { id, site_id, name, k1, k2, k3, k4, k5, type } of metrics) {
      const dimensions = [k1, k2, k3, k4, k5].filter(v => v);
      const k = [
        site_id,
        id,
        dimensions.map(dimension => qs[dimension])
      ].join('/');

      if (!this.stats[type]) {
        this.stats[type] = {};
      }

      if (think.isEmpty(this.stats[type][k])) {
        this.stats[type][k] = {
          metric_id: id,
          site_id,
          k1: qs[k1],
          k2: qs[k2],
          k3: qs[k3],
          k4: qs[k4],
          k5: qs[k5],
          time: +qs[name],
          count: 1,
        };
      } else {
        this.stats[type][k].time += +qs[name];
        this.stats[type][k].count += 1;
      }
    }

    return true;
  }

  cleanAction() {

  }
};
