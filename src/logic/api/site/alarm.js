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
   * @api {GET} /site/:id/alarm 获取网站已有报警列表
   * @apiGroup Site
   * @apiVersion  0.0.1
   */
  getAction() {
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
  /**
   * @api {POST} /site/:id/alarm 为网站添加报警
   * @apiGroup Site
   * @apiVersion 0.0.1
   */
  postAction() {
    this.rules = {
      name: {
        require: true,
        string: true
      },
      metric_id: {
        int: true,
        require: true
      },
      condition: {
        json: true
      }
    }
  }

  /**
   * @api {PUT} /site/:id/alarm/:alarm_id 修改网站报警
   * @apiGroup Site
   * @apiVersion 0.0.1
   */
  putAction() {
    if (!this.id) {
      return this.fail();
    }

    this.rules = {
      name: {
        string: true
      },
      metric_id: {
        int: true
      },
      condition: {
        json: true
      }
    };
  }

  /**
   * @api {DELETE} /site/:id/alarm/:alarm_id 为网站删除报警
   * @apiGroup Site
   * @apiVersion 0.0.1
   */
  deleteAction() {
    if (!this.id) {
      return this.fail();
    }
  }
};
