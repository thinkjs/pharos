module.exports = class extends think.Controller {
  async __before() {
    if (this.ctx.action !== 'install') {
      if (!global.isInstalled) {
        return this.redirect('/index/install');
      }
    }
    // session
    const userInfo = await this.session('userInfo') || {};
    this.assign({userInfo: JSON.stringify(userInfo, null, '\t')});
  }

  async __call() {
    return this.display('index_index');
  }
};
