const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  async postAction() {
    // 校验帐号和密码
    const {credential, password} = this.post();
    const userModel = this.model('user');
    const userInfo = await userModel.where({
      name: credential,
      email: credential,
      _logic: 'OR'
    }).field('id,email,name,password,display_name,status').find();

    // 账号不存在或者被删除
    if (
      think.isEmpty(userInfo) ||
      userInfo.status === global.ROLES.WRITE_OFF ||
      !userModel.checkPassword(userInfo, password)
    ) {
      return this.fail('ACCOUNT_ERROR');
    }

    delete userInfo.password;
    await this.session('userInfo', userInfo);
    return this.success(userInfo);
  }

  async deleteAction() {
    await this.session('userInfo', null);
    return this.success();
  }
};
