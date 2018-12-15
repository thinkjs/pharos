const Base = require('./base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('site');
  }

  async getAction() {
    const { page, pagesize } = this.get();
    const isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status);

    if (this.id) {
      this.id = parseInt(this.id);
    }

    if (!isSuperAdmin) {
      let siteIds = await this.model('site_user').where({
        user_id: this.userInfo.id
      }).select();
      if (think.isEmpty(siteIds)) {
        siteIds = [null];
      } else {
        siteIds = siteIds.map(({ site_id }) => site_id);
      }

      if (this.id) {
        if (!site_id.includes(this.id)) {
          return this.fail('SITE PERMISSION DENY');
        }
      }

      this.modelInstance = this.modelInstance.where({
        id: ['IN', siteIds]
      });
    }

    if (this.id) {
      const siteInfo = await this.modelInstance.where({ id: this.id }).find();
      return this.success(siteInfo);
    }

    let result;
    if (page) {
      result = await this.modelInstance.page([page, pagesize]).countSelect();
    } else {
      result = await this.modelInstance.select();
    }
    return this.success(result);
  }

  async postAction() {
    const data = this.post();

    // check site
    const site = await this.modelInstance.where({
      url: data.url
    }).find();
    if (!think.isEmpty(site)) {
      return this.fail('SITE_EXIST');
    }

    data.user = [{ user_id: this.userInfo.id, status: global.ROLES.SITE_ADMIN }];
    const insertId = await this.modelInstance.addSite(data);
    return this.success(insertId);
  }

  async putAction() {
    if (!this.id) {
      return this.fail('SITE ID MISS');
    }

    const userInfo = await this.session('userInfo') || {};
    const role = await this.model('site_user')
      .where({ site_id: this.id, user_id: userInfo.id })
      .find();
    if (think.isEmpty(role) || global.ADMIN.is(role.status)) {
      return this.fail('PERMISSION_DENIED');
    }

    const { name } = this.post();
    if (!name) {
      return this.success();
    }

    await this.modelInstance.where({ id: this.id }).update({ name });
    return this.success();
  }

  async deleteAction() {
    if (!this.id) {
      return this.fail('SITE ID MISS');
    }

    this.id = parseInt(this.id);
    const userInfo = await this.session('userInfo') || {};
    if (!global.ADMIN.is(userInfo.status)) {
      const role = await this.model('site_user').where({
        user_id: userInfo.id,
        site_id: this.id
      }).find();
      if (think.isEmpty(role)) {
        return this.fail('PERMISSION_DENIED');
      }
    }

    return this.modelInstance.where({ id: this.id }).delete();
  }
};
