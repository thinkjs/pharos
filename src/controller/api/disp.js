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
      return {
        protocol: 'http:',
        url: 'test'
      };
      // return this.fail('REFERRER_EMPTY');
    }

    const { protocol, host, pathname, query } = url.parse(referrer);
    let visitUrl = host + pathname;
    if (query) {
      visitUrl += '?' + query;
    }
    return { protocol, url: visitUrl };
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
    const startTime = Date.now();
    const [
      country,
      region,
      city
    ] = await ipServiceInstance
      .ipFind(this.ip)
      .catch(() => ['', '', '']);

    const ipTime = Date.now() - startTime;
    // think.logger.debug(`ip parse costs ${ipTime}ms`);
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

    const data = global.PHAROS_DATA;
    const metric = properties.shift();
    if (!data[metric]) {
      data[metric] = {};
    }

    const indexs = [];
    const metricData = {};
    for (let i = 0; i < properties.length; i++) {
      const [name, val] = properties[i];
      indexs.push(val);
      metricData[name] = val;
    }

    const index = indexs.join('/');
    if (!data[metric][index]) {
      data[metric][index] = Object.assign(value, metricData);
    }
    return data[metric][index];
  }

  /** 对每个监控数据进行监控项行为的收集 */
  gather(data, { limit }) {
    const arr = [];
    return cb => {
      if (typeof cb === 'function') {
        return arr.push(cb);
      }

      for (const k in data) {
        if (data[k] < 0) {
          continue;
        }

        if (typeof limit === 'number' && data[k] > limit) {
          continue;
        }

        arr.forEach(fn => fn(data[k], k));
      }
    };
  }

  /** 查找时间所在区间 */
  findsection(time) {
    const section = global.section;
    for (let i = section.length - 1; i >= 0; i--) {
      if (time < section[i][0]) {
        continue;
      }
      return i;
    }
    return -1;
  }

  /** 获取 site_page_id */
  async sitePage(site_id, visit_url) {
    let sitePageId = null;

    const sitePages = await this.model('site_page').where({ site_id }).select();

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

  async gatherTask() {
    const startTime = Date.now();
    const { site_id, info: performance, error } = this.get();
    const visit_url = this.visitUrl;
    const user_ua = this.userUA;

    const options = await this.model('options').getOptions(site_id);
    const gather = this.gather(performance, options);

    const location = await this.userIP();
    const site_page_id = await this.sitePage(site_id, visit_url.url);
    const perfs = await this.getPerfs(site_id);
    const beforeGatherTime = Date.now() - startTime;
    think.logger.debug(`before gather costs ${beforeGatherTime}ms`);

    gather((time, perf) => {
      if (!perfs[perf]) {
        return;
      }
      const section = this.findsection(time);
      const consume_time = this.global(
        [
          'consume_time',
          ['site_id', site_id],
          ['site_page_id', site_page_id],
          ['perf', perfs[perf]],
          ['section', section]
        ],
        { time: 0, count: 0 }
      );
      consume_time.time += time;
      consume_time.count += 1;
    });
    gather((time, perf) => {
      if (!perfs[perf]) {
        return;
      }
      const browser_time = this.global(
        [
          'browser_time',
          ['site_id', site_id],
          ['site_page_id', site_page_id],
          ['perf', perfs[perf]],
          ['browser', user_ua.browser_name],
          ['version', user_ua.browser_version]
        ],
        { time: 0, count: 0 }
      );
      browser_time.time += time;
      browser_time.count += 1;
    });
    gather((time, perf) => {
      if (!perfs[perf]) {
        return;
      }
      const os_time = this.global(
        [
          'os_time',
          ['site_id', site_id],
          ['site_page_id', site_page_id],
          ['perf', perfs[perf]],
          ['os', user_ua.os],
          ['version', user_ua.os_version]
        ],
        { time: 0, count: 0 }
      );
      os_time.time += time;
      os_time.count += 1;
    });
    gather((time, perf) => {
      if (!perfs[perf]) {
        return;
      }
      const region_time = this.global(
        [
          'region_time',
          ['site_id', site_id],
          ['site_page_id', site_page_id],
          ['perf', perfs[perf]],
          // ['country', location.country],
          ['region', location.region]
          // ['city', location.city]
        ],
        { time: 0, count: 0 }
      );
      region_time.time += time;
      region_time.count += 1;
    });
    gather();

    if (error) {
      const js_error = this.global(
        [
          'js_error',
          ['site_id', site_id],
          ['site_page_id', site_page_id],
          ['error', error]
        ],
        { count: 0 }
      );
      js_error.count += 1;
    }

    const gatherTime = Date.now() - startTime - beforeGatherTime;
    think.logger.debug(`gather costs ${gatherTime}ms`);
  }

  getAction() {
    // 异步不等待让请求优先返回
    setTimeout(() => this.gatherTask(), 50);

    this.ctx.type = 'gif';
    this.ctx.body = Buffer.from(
      'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );
    return false;
  }
};
