const Base = require('./base');
module.exports = class extends Base {
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
   */ 
  postAction() {
  }

  /**
   * @api {DELETE} /site/:id/user/:user_id 为网站删除成员
   * @apiGroup Site
   * @apiVersion 0.0.1
   */ 
  deleteAction() {

  }
};
