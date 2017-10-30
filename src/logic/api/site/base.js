module.exports = class extends think.Logic {
  async __before() {
    const {site_id} = this.get();
    if (!site_id) {
      return this.fail('SITE_ID MISS');
    }

    const userInfo = await this.session('userInfo') || {};
    const isSiteUser = await this.model('site_user').where({
      site_id,
      user_id: userInfo.id
    }).find();
    if (think.isEmpty(isSiteUser)) {
      return this.fail('PERMISSION_DENIED');
    }
  }
};
