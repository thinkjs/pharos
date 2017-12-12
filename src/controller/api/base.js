const BaseRest = require('../rest');

module.exports = class extends BaseRest {
  async __before() {
    if (!this.isCli && !this.isGet) {
      const referrer = this.referrer(true);
      const {site_url} = await this.model('options').getOptions();
      if (referrer.indexOf(site_url) !== 0) {
        return this.fail();
      }
    }
    // session
    const userInfo = await this.session('userInfo') || {};
    this.userInfo = userInfo;
  }
};
