module.exports = class extends think.Controller {
  async __before() {
    // session
    const userInfo = await this.session('userInfo') || {};
    this.assign({userInfo: JSON.stringify(userInfo, null, '\t')});
  }
};
