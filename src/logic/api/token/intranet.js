module.exports = class extends think.Logic {
  /**
   * @api {GET} /token/intranet 内网登录
   * @apiGroup  User
   * @apiVersion  0.0.1
   */
  async getAction() {
    const userInfo = await this.session('userInfo');
    if (!think.isEmpty(userInfo)) {
      return this.redirect('/');
    }

    const intranet = think.config('login.intranet');
    if (!think.isFunction(intranet)) {
      return this.fail('DOMAIN_ACCOUNT FAILED');
    }
  }
};
