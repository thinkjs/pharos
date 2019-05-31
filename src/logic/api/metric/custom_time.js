const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/custom_time 获取某段时间自定义监控的数据
   * @apiGroup Metric
   * @apiVersion  0.0.1
   *
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}  metric_id 监控项ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   * @apiParam  {String}  metric {k1,k2,k3,k4,k5}  类型
   * @apiParam  {String}  type {min}  时间类型
   * 
   * @apiSuccessExample {json} 成功返回
   * {
   *   errno: 0,
   *   data: {
   *       category: ["05-24 00:00", "05-24 00:05",],
   *       series: [
   *         {
   *           name: 'Chrome',
   *           data: [50, 20]
   *         }
   *       ]
   *   },
   *   errmsg: ''
   * }
   */


  getAction() {
    const ONE_DAY = 24 * 3600000;
    const ONE_MONTH = ONE_DAY * 30;
    const INTERVAL = this.get('type') === 'day' ? ONE_MONTH : 0;

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
        default: think.datetime(Date.now() + ONE_DAY, 'YYYY-MM-DD')
      },
      type: {
        in: ['mins']
      },
      metric: {
        required: true,
        default: 'k1',
        in: ['k1','k2','k3','k4','k5']
      }
    };
  }
};
