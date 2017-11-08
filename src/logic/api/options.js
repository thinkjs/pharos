const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /options 获取网站配置
   * @apiGroup System
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int} site_id 网站ID
   */  
  getAction() {
    this.rules = {
      site_id: {
        int: true,
        default: 0
      }
    };
  }

  /**
   * @api {POST} /options 更新网站配置
   * @apiGroup  System
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}  site_id  网站ID
   * @apiParam  {String}  [name]  需要更新的选项，键为选项名称，值为选项的值
   */
  putAction() {
    this.rules = {
      site_id: {
        int: true,
        default: 0
      }
    };
  }
};
