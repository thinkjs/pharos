const Base = require('../base');
module.exports = class extends Base {
  async __before(...args) {
    await Base.prototype.__before.call(this, ...args);

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
