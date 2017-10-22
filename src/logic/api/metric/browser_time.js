const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/browser_time 获取某指标不同浏览器下的耗时分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   * @apiParam  {String="loadPage","domReady","redirect","lookupDomain","ttfb","request","loadEvent","appcache","unloadEvent","connect"}  perf  性能名称  
   */   
  getAction() {
    this.rules = {
      site_id: {
        required: true,
        int: true
      },
      site_page_id: {
        int: true
      },
      start_time: {
        required: true
      },
      end_time: {
        required: true
      },
      perf: {
        in: global.perfs
      }
    };
  }
};
