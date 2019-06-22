const Base = require('./base');
const AppError = require('../../../extend/errors');
module.exports = class extends Base {
  async __before(...args) {
    await Base.prototype.__before.call(this, ...args);
    if (!this.isAdmin) {
      return this.fail(AppError.PERMISSION_DENIED);
    }
  }

  /**
   * @api {GET} /site/:id/alarmlog 获取网站报警历史
   * @apiGroup Site
   * @apiVersion  0.0.1
   * 
   * @apiParam  {String}  [page]  页数
   * @apiParam  {String}  [pagesize]  分页大小
   */
  async getAction() {
    const { site_id } = this.get();

    if (!site_id) {
      return this.fail('SITE ID MISS');
    }
    const sites = await this.model('site').where({ id: site_id }).select();
    if (think.isEmpty(sites)) {
      return this.fail('SITE NOT FOUND');
    }
    this.rules = {
      page: {
        int: true,
        default: 1
      },
      pagesize: {
        int: true,
        default: 10
      }
    };
  }
};
