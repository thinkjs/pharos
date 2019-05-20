const Base = require('./base');
module.exports = class extends Base {
    /**
   * @api {GET} /metric 获取监控项列表
   * @apiGroup Site
   * @apiVersion  0.0.1
   *
   * @apiParam  {String}  keywords  display_name
   * @apiParam  {String}  page  页数
   * @apiParam  {String}  pagesize  分页大小
   * @apiParam  {String}  site_id  项目id
   */
    getAction() {
        this.rules = {
            page: {
                int: true
            },
            pagesize: {
                int: true,
                default: 10
            },
            site_id: {
                int: true,
                required: true,
            }
        }
    }

     /**
   * @api {POST} /metric 添加监控项
   * @apiGroup Site
   * @apiVersion  0.0.1
   *
   * @apiParam  {String}  name  英文名称
   * @apiParam  {String}  display_name  中文名称
   * @apiParam  {String}  [description]  描述
   * @apiParam  {String}  [k1]  k1英文名称
   * @apiParam  {String}  [k1_display_name]  k1中文名称 
   * @apiParam  {String}  [k2]  k2英文名称
   * @apiParam  {String}  [k2_display_name]  k2中文名称 
   * @apiParam  {String}  [k3]  k3英文名称
   * @apiParam  {String}  [k3_display_name]  k3中文名称 
   * @apiParam  {String}  [k4]  k4英文名称
   * @apiParam  {String}  [k4_display_name]  k4中文名称 
   * @apiParam  {String}  [k5]  k5英文名称
   * @apiParam  {String}  [k5_display_name]  k5中文名称 
   * @apiParam  {String}  [type]  类型
   */
    postAction() {
        this.rules = {
            name: {
                string: true,
                required: true,
            },
            display_name: {
                string: true,
                required: true,
            }
        }
    }
}