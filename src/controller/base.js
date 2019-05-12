module.exports = class extends think.Controller {
  async __before() {
    // session
    const userInfo = await this.session('userInfo') || {};

    const optModel = this.model('options');
    const options = await optModel.getOptions();
    this.assign({
      userInfo: JSON.stringify(userInfo, null, '\t'),
      options: JSON.stringify(options, null, '\t')
    });
  }

  async __call() {
    return this.display('index_index');
  }
};
