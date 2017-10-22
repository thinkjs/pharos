const url = require('url');
const BaseRest = require('../rest');

module.exports = class extends BaseRest {
  get visitUrl() {
    const referrer = this.referer();
    if (!referrer) {
      return this.fail('REFERRER_EMPTY');
    }

    const {protocol, host, pathname, query} = url.parse(referrer);
    let visitUrl = host + pathname;
    if (query) {
      visitUrl += '?' + query;
    }
    return {protocol, url: visitUrl};
  }

  /** 获取全局对象当其不存在时赋初值 */
  global(properties, value = {}) {
    if (!Array.isArray(properties)) {
      properties = [properties];
    }

    let data = global.PHAROS_DATA;
    const lastProperty = properties.pop();
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (!data.hasOwnProperty(property)) {
        data[property] = {};
      }
      data = data[property];
    }

    if (!data.hasOwnProperty(lastProperty)) {
      data[lastProperty] = value;
    }
    return data[lastProperty];
  }

  /** 对每个监控数据进行监控项行为的收集 */
  gather(data) {
    const arr = [];
    return cb => {
      if (typeof cb === 'function') {
        return arr.push(cb);
      }

      for (const k in data) {
        arr.forEach(fn => fn(data[k], k));
      }
    };
  }

  /** 查找时间所在区间 */
  findInterval(time) {
    const interval = global.interval;
    for (let i = interval.length - 1; i >= 0; i--) {
      if (time < interval[i][0]) {
        continue;
      }
      return i;
    }
    return -1;
  }

  /** 获取 site_page_id */
  async sitePage(site_id, visit_url) {
    let sitePageId = null;

    const sitePages = await this.model('site_page').where({site_id}).select();

    if (think.isEmpty(sitePages)) {
      return sitePageId;
    }

    for (const sitePage of sitePages) {
      const exp = new RegExp('/' + sitePage.url + '/', 'i');
      if (!exp.test(visit_url)) {
        continue;
      }

      sitePageId = sitePage.id;
      break;
    }

    return sitePageId;
  }

  async getAction() {
    const {site_id, info: performance} = this.get();
    const visit_url = this.visitUrl;
    const gather = this.gather(performance);
    const site_page_id = await this.sitePage(site_id, visit_url.url);
    gather((time, perf) => {
      const interval = this.findInterval(time);
      const consume_time = this.global(
        ['consume_time', site_id, site_page_id, global.perfs[perf], interval],
        {time: 0, count: 0}
      );
      consume_time.time += time;
      consume_time.count += 1;
    });
    gather();
    this.ctx.type = 'gif';
    this.ctx.body = Buffer.from(
      'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );
    return false;
  }
};
