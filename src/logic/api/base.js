const AppError = require('../../extend/errors');
module.exports = class extends think.Logic {
  async __before() {
    if (!this.isCli && !this.isGet) {
      // const referrer = this.referrer(true);
      // const {site_url} = await this.model('options').getOptions();
      // if (!site_url || referrer.indexOf(site_url) !== 0) {
      //   return this.fail();
      // }
    }

    const userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      this.fail(AppError.USER_NOT_LOGIN);
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
      return this.fail(AppError.PERMISSION_DENIED);
    }

    this.isAdmin = global.ADMIN.is(siteUser.status);
  }
};
