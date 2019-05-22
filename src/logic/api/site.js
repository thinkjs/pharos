const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /site 获取网站列表
   * @apiGroup Site
   * @apiVersion  0.0.1
   *
   * @apiParam  {String}  keywords  url 或 name
   * @apiParam  {String}  page  页数
   * @apiParam  {String}  pagesize  分页大小
   */
  /**
   * @api {GET} /site/:id 获取网站信息
   * @apiGroup  Site
   * @apiVersion  0.0.1
   */
  getAction() {
    this.rules = {
      page: {
        int: true
      },
      pagesize: {
        int: true,
        default: 10
      }
    };
  }

  /**
   * @api {POST} /site 添加网站
   * @apiGroup Site
   * @apiVersion 0.0.1
   *
   * @apiParam  {String}  url  网站地址
   * @apiParam  {String}  name  网站名称
   */
  async postAction() {
    const rules = {
      url: {
        required: true,
        url: {
          require_tld: true, // 需要顶级域
          require_protocol: false, // 不需要协议
          require_host: true, // 需要一级域
          allow_underscores: true, // 允许下划线
          host_whitelist: false, // 不做白名单
          host_blacklist: false, // 不做黑名单
          allow_trailing_dot: false, // 不允许域名后带点行为
          allow_protocol_relative_urls: false // 不允许相对协议
        }
      },
      name: {
        required: true,
        string: true,
        length: {min: 4, max: 20}
      }
    };

    const flag = this.validate(rules);
    if (!flag) {
      return this.fail('validate error', this.validateErrors);
    }
  }
  /**
   * @api {PUT} /site/:id 修改网站信息
   * @apiGroup Site
   * @apiVersion 0.0.1
   *
   * @apiParam  {String}  name  网站名称
   */
  async putAction() {
    const rules = {
      name: {
        string: true,
        length: {min: 4, max: 20},
        required: true,
      },
      url: {
        string: true,
        required: true,
      }
    };
    const flag  = this.validate(rules);
    if(!flag) {
      return this.fail(this.validateErrors);
    }
    if (!this.id) {
      return this.fail('SITE ID MISS');
    }
    const isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status);
    if (!isSuperAdmin) {
      const role = await this.model('site_user')
        .where({ site_id: this.id, user_id: this.userInfo.id })
        .find();
      // 不是超级管理员 也不是项目管理员 无权限
      if (think.isEmpty(role) || !global.ADMIN.is(role.status)) {
        return this.fail('PERMISSION_DENIED');
      }
    }
  }
  /**
   * @api {DELETE} /site/:id  删除网站
   * @apiGroup Site
   * @apiVersion  0.0.1
   */
  async deleteAction() {
    if (!this.id) {
      return this.fail('SITE ID MISS');
    }

    const isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status);
    if (!isSuperAdmin) {
      const role = await this.model('site_user').where({
        user_id: this.userInfo.id,
        site_id: this.id
      }).find();
      if (think.isEmpty(role) || !global.ADMIN.is(role.status)) {
        return this.fail('PERMISSION_DENIED');
      }
    }
  }
};
