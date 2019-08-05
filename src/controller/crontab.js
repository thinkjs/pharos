const moment = require('moment');
const Base = require('./base.js');

const TYPE_MAPS = { 0: 'custom_monitor', 1: 'perf_monitor', 2: 'error_monitor' };
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
      const site = sites[metric.site_id];
      if (!site) {
        continue;
      }

      const { sid } = site;
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
      if (!think.isExist(file)) {
        continue;
      }
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

    return this.action('crontab', 'alarm');
  }

  async alarmAction() {
    //获取所有的项目当前5分钟的监控数据
    //获取上一个5分钟的监控数据用来算增长速率
    const now = moment();
    const metricsDataPromise = [];
    for (var k in TYPE_MAPS) {
      metricsDataPromise.push(this.model(TYPE_MAPS[k]).where({
        create_time: ['in', [
          now.format('YYYY-MM-DD HH:mm:ss'),
          // now.subtract(5, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        ]]
      }).select());
    }
    const metricsData = (await Promise.all(metricsDataPromise)).flat();
    const metrics = {};
    for (let i = 0; i < metricsData.length; i++) {
      const { metric_id, create_time } = metricsData[i];
      if (think.isEmpty(metrics[metric_id])) {
        metrics[metric_id] = {};
      }

      metrics[metric_id][create_time] = metricsData[i];
    }

    //获取所有的报警策略
    const strategyData = await this.model('site_alarm').where('1=1').select();
    if (!strategyData.length) {
      return this.success();
    }

    const strategies = {};
    for (let i = 0; i < strategyData.length; i++) {
      const { metric_id } = strategyData[i];
      if (!think.isArray(strategies[metric_id])) {
        strategies[metric_id] = [];
      }

      strategies[metric_id].push(strategyData[i]);
    }

    //判断是否存在报警
    //检查报警是否已经存在（同类型的报警是否还在报警状态中）
    //如果已存在则对报警次数加1
    //不存在则新增一条
    const alarms = {};
    const alarmModel = this.model('alarm');
    for (const metric_id in strategies) {
      for (let i = 0; i < strategies[metric_id].length; i++) {
        const strategy = strategies[metric_id][i];
        if (!strategy) {
          continue;
        }
        if (think.isString(strategy.conditions)) {
          strategy.conditions = JSON.parse(strategy.conditions);
        }
        const { limit, count, express } = strategy.conditions;
        if (!metrics[metric_id]) {
          continue;
        }
        const nowValue = this.avg(metrics[metric_id][now.format('YYYY-MM-DD HH:mm:ss')], 0)

        const test = eval(`${nowValue} ${express} ${limit}`);
        if (!test) {
          continue;
        }
        alarms[strategy.id] = strategy;

        const ret = await alarmModel.where({ alarm_id, status: 0 }).find();
        const times = think.isEmpty(ret) ? 1 : ret.times + 1;
        if (think.isEmpty(ret)) {
          await alarmModel.add({
            site_id: alarm[alarm_id].site_id,
            metric_id: alarm[alarm_id].metric_id,
            alarm_id,
            status: 0,
            times,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
          })
        } else {
          await alarmModel.update({ id: ret.id, times });
        }

        if (think.isNumber(count) && times < count) {
          continue;
        }

        const text = `连续 ${count} 次 ${metric_name} ${express} ${limit}`;
        const users = this.sites[alarm[alarm_id].site_id].users;
        await this.config('alarm')(users, text);
      }
    }

    //最后对所有没有处理的还在报警状态中的报警置成已解决
    const alarm_ids = Object.keys(alarms);
    const where = { status: 0 };
    if (alarm_ids.length) {
      where.alarm_id = ['NOT_IN', alarm_ids];
    };

    await alarmModel.where(where).update({ status: 1 });
  }

  parseLog({ querystring: qs, pathname, http_referer }) {
    if (!pathname.includes('/pharos.gif')) {
      return;
    }
    const { site_id } = qs;
    const url = Object.values(this.sites).filter(site => site.sid === site_id)[0].url;
    if (http_referer && !http_referer.includes(url)) {
      return;
    }

    const metrics = this.metrics[site_id];
    if (!think.isArray(metrics)) {
      return;
    }

    for (const { id, site_id, name, k1, k2, k3, k4, k5, type } of metrics) {
      if (type !== 2 && !qs[name]) {
        continue;
      }

      const dimensions = [k1, k2, k3, k4, k5].filter(v => v);
      const k = [
        site_id,
        id,
        ...dimensions.map(dimension => qs[dimension])
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
