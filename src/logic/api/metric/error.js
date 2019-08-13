const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/error 获取错误列表
   * @apiGroup Metric
   * @apiVersion  0.0.1
   *
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}  metric_id 监控项ID
   * 
   * @apiSuccessExample {json} 成功返回
   * {
   *   errno: 0,
   *   data: [
   *     {
   *        errmsg: 'TypeError: a is not a number',
   *        count: 2
   *     }
   *   ],
   *   errmsg: ''
   * }
   */


  async getAction() {
    const { metric_id } = this.get();
    const metrics = await this.model('metric').where({id: metric_id}).select();
    if (think.isEmpty(metrics)) {
      return this.fail('METRIC NOT FOUND');
    }

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