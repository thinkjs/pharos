const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/ratio 获取同环比数据
   * @apiGroup Metric
   * @apiVersion  0.0.2
   *
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}  metric_id 监控项ID
   * 
   * @apiSuccessExample {json} 成功返回
   * {
   *   errno: 0,
   *   data: {
   *     category: ["00:00", "00:05",],
   *     series: [
   *       {
   *         name: '2019-06-22',
   *         data: [50, 20]
   *       },
   *       {
   *         name: '2019-06-21',
   *         data: [60, 50]
   *       },
   *       {
   *         name: '2019-06-15',
   *         data: [30, 10]
   *       },
   *     ]
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
