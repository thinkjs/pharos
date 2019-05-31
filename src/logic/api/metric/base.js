const Base = require('../base');
module.exports = class extends Base {
  async __before(...args) {
    if (!this.isCli) {
      await Base.prototype.__before.call(this, ...args);
      await this.siteUserCheck();
    }
  }

  postAction() {
    if (!this.isCli) return this.fail();
  }
};
