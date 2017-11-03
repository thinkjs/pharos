const Base = require('./base');
module.exports = class extends Base {
  async __before(...args) {
    await Base.prototype.__before.call(this, ...args);

    if (!this.isAdmin && this.ctx.method !== 'GET') {
      return this.fail('PERMISSION_DENIED');
    }
  }
  /**
   * @api {GET} /site/:id/perf 获取网站性能指标列表
   * @apiGroup Site
   * @apiVersion  0.0.1
   */
  getAction() {

  }

  /**
   * @api {POST} /site/:id/perf 为网站添加性能指标字段
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {String}  name  性能指标名称
   * @apiParam  {String}  description  性能指标描述
   */ 
  postAction() {
    this.rules = {
      name: {
        required: true,
        alphaDash: true,
        length: {min: 4, max: 20}
      },
      description: {
        length: {max: 150}
      }
    };
  }

  /**
   * @api {PUT} /site/:id/perf/:id 修改性能指标字段
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {String}  name  性能指标名称
   * @apiParam  {String}  description  性能指标描述
   */ 
  putAction() {
    this.rules = {
      name: {
        alphaDash: true,
        length: {min: 4, max: 20}
      },
      description: {
        length: {max: 150}
      }
    };
  }

  /**
   * @api {DELETE} /site/:id/perf/:id 为网站删除性能指标字段
   * @apiGroup Site
   * @apiVersion 0.0.1
   */ 
  deleteAction() {
  }
};
