const crypto = require('crypto');
const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  /** 获取访问用户 id */
  get visitUser() {
    let visitUser = this.cookie('_pharos_id');
    if (visitUser) {
      return visitUser;
    }

    visitUser = crypto.randomBytes(8).toString('hex');
    this.cookie('_pharos_id', visitUser);
    return visitUser;
  }

  /** 根据 UA 获取信息 */
  get userUA() {
    return {};
  }

  async getAction() {
    const visitUser = this.visitUser;
    const userInfo = this.userUA;
    userInfo.screen = this.get('screen');
    userInfo.ip = this.ip;
    userInfo.loc = this.getIpLoc(this.ip);

    const user = await this.modelInstance.where({
      idvisitor: visitUser
    }).find();
    userInfo.last_action_time = think.datetime();
    if (!think.isEmpty(user)) {
      userInfo.first_action_time = userInfo.last_action_time;
      await this.modelInstance.add(userInfo);
    } else {
      await this.modelInstance.where({id: user.id}).update(userInfo);
    }

    return this.success();
  }
};
