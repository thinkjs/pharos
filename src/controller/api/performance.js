const url = require('url');
const path = require('path');
const crypto = require('crypto');
const detector = require('detector');
const BaseRest = require('../rest');
const IPService = require('../../service/ipip');
const ipServiceInstance = new IPService(path.join(think.ROOT_PATH, 'www/ip.dat'));

module.exports = class extends BaseRest {
  /** 获取访问用户 id */
  get visitUser() {
    let visitUser = this.cookie('_pharos_id');
    if (visitUser) {
      return visitUser;
    }

    visitUser = crypto.randomBytes(8).toString('hex');
    this.cookie('_pharos_id', visitUser);
    return visitUser;
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
      location_country, // eslint-disable-line camelcase
      location_province, // eslint-disable-line camelcase
      location_city // eslint-disable-line camelcase
    ] = await ipServiceInstance
      .ipFind(this.ip)
      .catch(() => ['', '', '']);

    return {
      location_ip: this.ip,
      location_country,
      location_province,
      location_city,
      location_isp: ''
    };
  }

  get performance() {
    return this.get('info');
    // const t = this.get('info');
    // const times = {};

    // // 【重要】页面加载完成的时间
    // // 【原因】这几乎代表了用户等待页面可用的时间
    // times.loadPage = t.loadEventEnd - t.navigationStart;

    // // 【重要】解析 DOM 树结构的时间
    // // 【原因】反省下你的 DOM 树嵌套是不是太多了！
    // times.domReady = t.domComplete - t.responseEnd;

    // // 【重要】重定向的时间
    // // 【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    // times.redirect = t.redirectEnd - t.redirectStart;

    // // 【重要】DNS 查询时间
    // // 【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
    // times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

    // // 【重要】读取页面第一个字节的时间
    // // 【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // // TTFB 即 Time To First Byte 的意思
    // // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    // times.ttfb = t.responseStart - t.navigationStart;

    // // 【重要】内容加载完成的时间
    // // 【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    // times.request = t.responseEnd - t.requestStart;

    // // 【重要】执行 onload 回调函数的时间
    // // 【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    // times.loadEvent = t.loadEventEnd - t.loadEventStart;

    // // DNS 缓存时间
    // times.appcache = t.domainLookupStart - t.fetchStart;

    // // 卸载页面的时间
    // times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

    // // TCP 建立连接完成握手的时间
    // times.connect = t.connectEnd - t.connectStart;

    // times.raw = JSON.stringify(t);
    // return times;
  }

  get visitUrl() {
    const {protocol, host, pathname, query} = url.parse(this.referer());
    let visitUrl = host + pathname;
    if (query) {
      visitUrl += '?' + query;
    }
    return {
      url: visitUrl,
      title: this.get('title'),
      protocol
    };
  }

  async getAction() {
    const visitUser = this.visitUser;
    const visitUrl = this.visitUrl;
    const ua = this.userUA;
    const ip = await this.userIP();

    const user = {
      idvisitor: visitUser,
      last_action_time: think.datetime(),
      ...ua,
      ...ip
    };

    const performance = this.performance;
    performance.site_id = this.get('site_id');

    /** 判断是否有 site */
    let result = await this.model('site').where({
      id: performance.site_id
    }).find();
    if (think.isEmpty(result)) {
      return this.fail('SITE_EMPTY');
    }

    /** 获取 site_page_id */
    performance.site_page_id = null;
    const sitePages = await this.model('site_page').where({
      site_id: performance.site_id
    }).select();

    if (!think.isEmpty(sitePages)) {
      for (const sitePage of sitePages) {
        const exp = new RegExp('/' + sitePages.url + '/', 'i');
        if (!exp.test(visitUrl.url)) {
          continue;
        }

        performance.site_page_id = sitePage.id;
        break;
      }
    }

    /** 获取 visit_url_id */
    result = await this.model('visit_url').where({
      url: visitUrl.url
    }).thenAdd(visitUrl);
    performance.visit_url_id = result.id;

    /** 获取 user_id */
    const userInfo = await this.model('visit_user').where({
      idvisitor: visitUser
    }).find();

    let visit_user_id;
    if (think.isEmpty(userInfo)) {
      user.first_action_time = user.last_action_time;
      visit_user_id = await this.model('visit_user').add(user);
    } else {
      visit_user_id = userInfo.id;
      await this.model('visit_user').where({
        id: userInfo.id
      }).update(user);
    }

    performance.visit_user_id = visit_user_id;

    performance.create_time = think.datetime();
    await this.modelInstance.add(performance);

    this.ctx.type = 'gif';
    this.ctx.body = Buffer.from(
      'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );
    return false;
  }
};
