const url = require('url');
const path = require('path');
const crypto = require('crypto');
const detector = require('detector');
const BaseRest = require('../rest');
const IPService = require('../../service/ip');
const ipServiceInstance = new IPService(path.join(think.ROOT_PATH, 'www/ip.txt'));

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
      browser_version: ua.broswer.version,
      device_brand: ua.device.name,
      // device_model: ua.device,
      // device_type:,
      device_pixel: this.get('screen'),
      os: ua.os.name,
      os_version: ua.os.version
    };
  }

  /** 根据 IP 获取位置信息 */
  get userIP() {
    const {
      country,
      province,
      town,
      carrier
    } = ipServiceInstance.find(this.ip);
    return {
      location_ip: this.ip,
      location_country: country,
      location_province: province,
      location_city: town,
      location_isp: carrier
    };
  }

  get performance() {
    const t = this.get('info');
    const times = {};

    // 【重要】页面加载完成的时间
    // 【原因】这几乎代表了用户等待页面可用的时间
    times.loadPage = t.loadEventEnd - t.navigationStart;

    // 【重要】解析 DOM 树结构的时间
    // 【原因】反省下你的 DOM 树嵌套是不是太多了！
    times.domReady = t.domComplete - t.responseEnd;

    // 【重要】重定向的时间
    // 【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    times.redirect = t.redirectEnd - t.redirectStart;

    // 【重要】DNS 查询时间
    // 【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
    times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

    // 【重要】读取页面第一个字节的时间
    // 【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = t.responseStart - t.navigationStart;

    // 【重要】内容加载完成的时间
    // 【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.request = t.responseEnd - t.requestStart;

    // 【重要】执行 onload 回调函数的时间
    // 【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    times.loadEvent = t.loadEventEnd - t.loadEventStart;

    // DNS 缓存时间
    times.appcache = t.domainLookupStart - t.fetchStart;

    // 卸载页面的时间
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

    // TCP 建立连接完成握手的时间
    times.connect = t.connectEnd - t.connectStart;

    times.raw = JSON.stringify(t);
    return times;
  }

  get visitUrl() {
    const {protocol, host, pathname, query} = url.parse(this.referer());
    return {
      url: `${host}/${pathname}?${query}`,
      title: this.get('title'),
      protocol
    };
  }

  async getAction() {
    const visitUser = this.visitUser;
    const ua = this.userUA;
    const ip = this.userIP;

    const user = {
      idvisitor: visitUser,
      last_action_time: think.datetime(),
      performance: this.performance,
      visit_url: this.visitUrl,
      ...ua,
      ...ip
    };

    const userInfo = await this.modelInstance.where({
      idvisitor: visitUser
    }).find();

    if (!think.isEmpty(userInfo)) {
      user.first_action_time = user.last_action_time;
      await this.modelInstance.add(user);
    } else {
      await this.modelInstance.where({id: userInfo.id}).update(user);
    }

    return this.success();
  }
};
