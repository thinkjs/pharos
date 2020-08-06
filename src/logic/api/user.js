const Base = require('./base');
module.exports = class extends Base {
  async __before(...args) {
    if (this.isPost) {
      const { register_off } = await this.model('options').getOptions();
      if (register_off) {
        return this.fail('REGISTER_DENIED');
      }

      return true;
    }
    await Base.prototype.__before.call(this, ...args);
    this.isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status);
  }
  /**
   * @api {GET} /user 获取用户列表
   * @apiGroup User
   * @apiVersion  0.0.1
   *
   * @apiParam  {String}  keyword 搜索关键词
   * @apiParam  {String}  page  页数
   * @apiParam  {String}  pagesize  分页大小
   */
  getAction() {
    // default return first page
    // after pages should have super admin permission
    if (this.get('page') && !this.isSuperAdmin) {
      return this.fail('PERMISSION_DENIED');
    }

    this.rules = {
      page: {
        int: true
        // default: 1
      },
      pagesize: {
        int: { max: 20 },
        default: 10
      }
    };
  }
  /**
   * @api {POST} /user 用户注册
   * @apiGroup User
   * @apiVersion 0.0.1
   *
   * @apiParam  {String}  name  用户 ID
   * @apiParam  {String}  display_name  用户昵称
   * @apiParam  {String}  email 用户邮箱
   * @apiParam  {String}  password  用户密码
   */
  postAction() {
    this.rules = {
      name: {
        required: true,
        string: true,
        regexp: /[a-z0-9-_.]{4,}/i
      },
      display_name: {
        required: true,
        string: true,
        length: { min: 4, max: 10 }
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        string: true,
        length: { min: 8, max: 20 }
      },
      status: {
        int: true,
        value: 0
      }
    };
  }

  /**
   * @api {DELETE} /user/:id 用户删除
   * @apiGroup User
   * @apiVersion 0.0.1
   */
  deleteAction() {
    if (!this.isSuperAdmin) {
      return this.fail('PERMISSION_DENIED');
    }
  }

  /**
   * @api {PUT} /user/:id 更新用户信息
   * @apiGroup  User
   * @apiVersion  0.0.1
   *
   * @apiParam  {String}  display_name  用户昵称
   * @apiParam  {String}  password  用户密码
   * @apiParam  {String}  status  用户状态
   */
  putAction() {
    // Suer Admin
    // Modify info myself
    // Others have no permission
    if (!this.id) {
      return this.fail('MISS_ID');
    } else if (!this.isSuperAdmin) {
      if (this.id !== this.userInfo.id) {
        return this.fail('PERMISSION_DENIED');
      } else {
        this.get('status', undefined);
      }
    }

    this.rules = {
      display_name: {
        string: true,
        length: { min: 4, max: 10 }
      },
      password: {
        string: true,
        length: { min: 8, max: 20 }
      },
      status: {
        int: true
      }
    };
  }
};
