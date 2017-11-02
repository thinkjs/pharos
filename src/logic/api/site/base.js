const Base = require('../base');
module.exports = class extends Base {
  async __before(...args) {
    const result = await Base.prototype.__before.call(this, ...args);
    if (result) {
      return result;
    }

    const {site_id} = this.get();
    if (!site_id) {
      return 'SITE_ID MISS';
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
      return 'PERMISSION_DENIED';
    }

    this.isAdmin = global.ADMIN.is(siteUser.status);
  }
};
