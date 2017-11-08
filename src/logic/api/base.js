module.exports = class extends think.Logic {
  async __before() {
    const userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      this.fail('USER_NOT_LOGIN');
    }
    this.userInfo = userInfo;
  }

  /**
   * get resource
   * @return {String} [resource name]
   */
  get resource() {
    const filename = this.ctx.controller;
    return filename.split('/').pop();
  }
  get id() {
    const id = this.get('id');
    if (id && (think.isString(id) || think.isNumber(id))) {
      return parseInt(id);
    }
    const last = decodeURIComponent(this.ctx.path.split('/').pop());
    if (last !== this.resource && /^(\d+,?)*$/.test(last)) {
      return last;
    }
    return undefined;
  }

  async siteUserCheck() {
    if (this.isCli) {
      return true;
    }

    const {site_id} = this.get();
    if (!site_id) {
      return this.fail('SITE_ID MISS');
    }

    if (global.SUPER_ADMIN.is(this.userInfo.status)) {
      this.isAdmin = true;
      return;
    }

    const siteUser = await this.model('site_user').where({
      site_id,
      user_id: this.userInfo.id
    }).find();
    if (think.isEmpty(siteUser)) {
      return this.fail('PERMISSION_DENIED');
    }

    this.isAdmin = global.ADMIN.is(siteUser.status);
  }
};
