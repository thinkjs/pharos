const BaseRest = require('../rest');

module.exports = class extends BaseRest {
  async __before() {
    // session
    const userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      return this.fail('USER_NOT_LOGIN');
    }

    this.userInfo = userInfo;
  }
};
