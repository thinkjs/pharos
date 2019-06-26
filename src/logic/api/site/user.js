const Base = require('./base');
const AppError = require('../../../extend/errors');
module.exports = class extends Base {
  // async __before(...args) {
  //   await Base.prototype.__before.call(this, ...args);
  //   if (!this.isAdmin) {
  //     return this.fail(AppError.PERMISSION_DENIED);
  //   }
  // }
  /**
   * @api {GET} /site/:id/user 获取网站成员
   * @apiGroup Site
   * @apiVersion  0.0.1
   */
  getAction() {
  }
  /**
   * @api {POST} /site/:id/user/:user_id 为网站添加成员
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {Int=0,1}  status  角色代号
   */ 
  postAction() {
    if (!this.isAdmin) {
      return this.fail(AppError.PERMISSION_DENIED);
    }
  }

  /**
   * @api {PUT} /site/:id/user/:user_id 修改网站成员角色
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam {Int=0,1} status 角色代号
   */ 
  putAction() {
    if (!this.isAdmin) {
      return this.fail(AppError.PERMISSION_DENIED);
    }
    this.rules = {
      status: {
        int: true,
        required: true,
        default: global.ROLES.NORMAL_USER,
        in: [global.ROLES.NORMAL_USER, global.ROLES.SITE_ADMIN]
      }
    };
  }

  /**
   * @api {DELETE} /site/:id/user/:user_id 为网站删除成员
   * @apiGroup Site
   * @apiVersion 0.0.1
   */ 
  deleteAction() {
    if (!this.isAdmin) {
      return this.fail(AppError.PERMISSION_DENIED);
    }
  }
};
