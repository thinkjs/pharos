module.exports = class extends think.Logic {
  async __before() {
    const userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      this.fail('USER_NOT_LOGIN');
    }
    this.userInfo = userInfo;
  }
};
