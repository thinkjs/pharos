const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/ratio 获取同环比数据
   * @apiGroup Metric
   * @apiVersion  0.0.1
   *
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}  metric_id 监控项ID
   * 
   * @apiSuccessExample {json} 成功返回
   * {
   *   errno: 0,
   *   data: {
   *       today: {
   *         category: ["05-24 00:00", "05-24 00:05",],
   *         series: [
   *           {
   *             name: 'Chrome',
   *             data: [50, 20]
   *           }
   *         ]
   *       },
   *       yesterday: {
   *         category: ["05-24 00:00", "05-24 00:05",],
   *         series: [
   *           {
   *             name: 'Chrome',
   *             data: [50, 20]
   *           }
   *         ]
   *       },
   *       this_week: {
   *         category: ["05-24 00:00", "05-24 00:05",],
   *         series: [
   *           {
   *             name: 'Chrome',
   *             data: [50, 20]
   *           }
   *         ]
   *       },
   *       last_week: {
   *         category: ["05-24 00:00", "05-24 00:05",],
   *         series: [
   *           {
   *             name: 'Chrome',
   *             data: [50, 20]
   *           }
   *         ]
   *       }
   *   },
   *   errmsg: ''
   * }
   */


  getAction() {
    const ONE_DAY = 24 * 3600000;
    const ONE_MONTH = ONE_DAY * 30;
    const INTERVAL = this.get('type') === 'day' ? ONE_MONTH : ONE_DAY;

    this.rules = {
      site_id: {
        required: true,
        int: true
      },
      metric_id: {
        required: true,
        int: true
      },
    };
  }
};
