const url = require('url');
const path = require('path');
const detector = require('detector');
const BaseRest = require('../rest');
const IPService = require('../../service/ipip');
const ipServiceInstance = new IPService(path.join(think.ROOT_PATH, 'www/ip.dat'));

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

  /** 根据 UA 获取信息 */
  get userUA() {
    const ua = detector.parse(this.userAgent);

    return {
      browser_engine: ua.engine.name,
      browser_name: ua.browser.name,
      browser_version: ua.browser.version,
      device_brand: ua.device.name,
      // device_model: ua.device,
      // device_type:,
      device_pixel: this.get('screen'),
      os: ua.os.name,
      os_version: ua.os.version
    };
  }

  /** 根据 IP 获取位置信息 */
  async userIP() {
    const [
      country,
      region,
      city
    ] = await ipServiceInstance
      .ipFind(this.ip)
      .catch(() => ['', '', '']);

    return {
      country,
      region,
      city,
      isp: ''
    };
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
    const user_ua = this.userUA;
    const gather = this.gather(performance);
    const location = await this.userIP();
    const site_page_id = await this.sitePage(site_id, visit_url.url);
    gather((time, perf) => {
      const interval = this.findInterval(time);
      const consume_time = this.global(
        [
          'consume_time',
          site_id,
          site_page_id,
          global.perfs[perf],
          interval
        ],
        {time: 0, count: 0}
      );
      consume_time.time += time;
      consume_time.count += 1;
    });
    gather((time, perf) => {
      const browser_time = this.global(
        [
          'browser_time',
          site_id,
          site_page_id,
          global.perfs[perf],
          user_ua.browser_name,
          user_ua.browser_version
        ],
        {time: 0, count: 0}
      );
      browser_time.time += time;
      browser_time.count += 1;
    });
    gather((time, perf) => {
      const os_time = this.global(
        [
          'os_time',
          site_id,
          site_page_id,
          global.perfs[perf],
          user_ua.os,
          user_ua.os_version
        ],
        {time: 0, count: 0}
      );
      os_time.time += time;
      os_time.count += 1;
    });
    gather((time, perf) => {
      const region_time = this.global(
        [
          'region_time',
          site_id,
          site_page_id,
          global.perfs[perf],
          location.country,
          location.region,
          location.city
        ],
        {time: 0, count: 0}
      );
      region_time.time += time;
      region_time.count += 1;
    });
    gather(); ;
    this.ctx.type = 'gif';
    this.ctx.body = Buffer.from(
      'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );
    return false;
  }
};
