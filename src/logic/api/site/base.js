const Base = require('../base');
module.exports = class extends Base {
  async __before(...args) {
    await Base.prototype.__before.call(this, ...args);
    await this.siteUserCheck();
  }
};
