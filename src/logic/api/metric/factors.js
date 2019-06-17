const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/factors 获取监控因子
   * @apiGroup Metric
   * @apiVersion  0.0.1
   *
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}  metric_id 监控项ID
   * @apiParam  {String}  [metrics] {[k1],[k2],[k3],[k4],[k5]]}  类型
   * 
   * @apiSuccessExample {json} 成功返回
   * {
   *   errno: 0,
   *   data: [
   *     'chrome',
   *     'firefox'
   *   ],
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
      start_time: {
        default: think.datetime(Date.now() - INTERVAL, 'YYYY-MM-DD')
      },
      end_time: {
        default: think.datetime(Date.now(), 'YYYY-MM-DD')
      },
      type: {
        in: ['mins', 'day'],
        default: 'mins'
      },
      metrics: {
        string: true,
      }
    };
  }
};
