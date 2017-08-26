const Base = require('./base');
module.exports = class extends Base {
  async getAction() {
    const {page, pagesize} = this.get();

    let siteIds = await this.model('site_user').where({
      user_id: this.userInfo.id
    }).select();
    if (think.isEmpty(siteIds)) {
      siteIds = [ null ];
    } else {
      siteIds = siteIds.map(({site_id}) => site_id);
    }

    const result = await this.modelInstance.where({
      id: ['IN', siteIds]
    }).page([page, pagesize]).countSelect();
    return this.success(result);
  }

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
