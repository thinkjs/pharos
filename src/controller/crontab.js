const moment = require('moment');
const Base = require('./base.js');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.stats = {};
  }

  async __before() {
    const siteIds = await this.model('site')
      .field('id,sid')
      .where('1=1')
      .select();
    const metrics = await this.model('metric').where('1=1').select();

    const sites = {};
    this.metrics = {};
    for (const { id, sid } of siteIds) {
      sites[id] = sites[sid];
      sites[sid] = sites[id];
    }
    for (const metric of metrics) {
      const sid = sites[metric.site_id];
      if (!think.isArray(this.metrics[sid])) {
        this.metrics[sid] = [];
      }
      this.metrics[sid].push(metric);
    }
  }

  async logstashAction() {
    const { logFile, logFormat } = this.config();
    const now = moment();
    for (let i = 1; i <= 5; i++) {
      const file = logFile(now.subtract(i, 'miniutes'));
      const parser = this.service('parser', logFormat);
      await parser.read(file, this.parseLog.bind(this));
    }

    const shouldAdd = [];
    const shouldUpdate = [];
    const modelInstance = this.model('custom_monitor');

    const result = await modelInstance.where({
      create_time: now.format('YYYY-MM-DD HH:mm:ss')
    }).select();
    const records = {};
    for (const { id, site_id, k1, k2, k3, k4, k5, time, count } of result) {
      const k = [id, site_id, k1, k2, k3, k4, k5].filter(v => v).join('/');
      records[k] = { id, time, count };
    }

    for (const k in this.stats) {
      if (!records[k]) {
        shouldAdd.push(this.stats[k]);
        continue;
      }

      records[k].time += this.stats[k].time;
      records[k].count += this.stats[k].count;
      shouldUpdate.push(records[k]);
    }

    await modelInstance.updateMany(shouldUpdate);
    await modelInstance.addMany(shouldAdd);

    return this.success();
  }

  parseLog({ querystring: qs }) {
    const { site_id } = qs;

    const metrics = this.metrics[site_id];
    if (!think.isArray(metrics)) {
      return;
    }

    for (const { id, site_id, name, k1, k2, k3, k4, k5 } of metrics) {
      const dimensions = [k1, k2, k3, k4, k5].filter(v => v);
      const k = [
        site_id,
        id,
        dimensions.map(dimension => qs[dimension])
      ].join('/');

      if (think.isEmpty(this.stats[k])) {
        this.stats[k] = {
          id,
          site_id,
          k1: qs[k1],
          k2: qs[k2],
          k3: qs[k3],
          k4: qs[k4],
          k5: qs[k5],
          time: qs[name],
          count: 1
        };
      } else {
        this.stats[k].time += qs[name];
        this.stats[k].count += 1;
      }
    }

    return true;
  }

  cleanAction() {

  }
};
