const BaseRest = require('../rest');

module.exports = class extends BaseRest {
  async __before() {
    // session
    const userInfo = await this.session('userInfo') || {};
    this.userInfo = userInfo;
  }
};
