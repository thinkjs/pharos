const moment = require('moment');
const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/js_error 获取当前网站的报错数据
   * @apiGroup JSError
   * @apiVersion  0.0.1
   *
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
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
        default: think.datetime(Date.now(), 'YYYY-MM-DD')
      },
      end_time: {
        default: think.datetime(Date.now() + 24 * 3600000, 'YYYY-MM-DD')
      },
      type: {
        default: 'day',
        in: ['day', 'day.hour', 'day.mins', 'hour', 'mins']
      }
    };
    const { type } = this.get();
    if (!type || /^day/.test(type)) {
      this.rules.start_time.default = moment().subtract(1, 'day').format('YYYY-MM-DD');
    }
  }
};
