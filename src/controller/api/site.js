const Base = require('./base');
module.exports = class extends Base {
  async postAction() {
    const data = this.post();

    // check site
    const site = await this.modelInstance.where({
      url: data.url
    }).find();
    if (!think.isEmpty(site)) {
      return this.fail('SITE_EXIST');
    }

    data.user = [this.userInfo.id];
    const insertId = await this.modelInstance.addSite(data);
    return this.success(insertId);
  }
};
