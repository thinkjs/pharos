const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /system 查看系统信息
   * @apiGroup System
   * @apiVersion  0.0.1
   */  
  getAction() {

  }

  /**
   * @api {PUT} /system 更新系统
   * @apiGroup  System
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int=1,2,3}  step  更新步骤
   */
  putAction() {
    this.rules = {
      step: {
        int: true,
        required: true,
        in: [1, 2, 3]
      },
      url: {
        string: true,
        requiredIf: ['step', 1]
      }
    };
  }
};
