const BaseRest = require('../../rest.js');
module.exports = class extends BaseRest {
  async getAction() {
    const {res, req} = this.ctx;
    const user = await think.config('login.intranet')(req, res);
    const {userMail, userName, displayName} = user;

    const userModel = this.model('user');
    let userInfo = await userModel.where({
      name: userName,
      email: userMail,
      _logic: 'OR'
    }).field('id,email,name,password,display_name,status').find();

    // 账号不存在则自动创建
    if (think.isEmpty(userInfo)) {
      try {
        await userModel.addUser({
          name: userName,
          email: userMail,
          display_name: displayName,
          // 内网注册直接生成随机密码
          paddword: think.uuid(),
          status: 0
        }, this.ctx.ip);

        userInfo = await userModel.where({
          email: userMail
        }).field('id,email,name,display_name,status').find();
      } catch (e) {
        return this.fail(e);
      }
    }

    if (userInfo.status === global.ROLES.WRITE_OFF) {
      return this.fail('ACCOUNT_ERROR');
    }

    delete userInfo.password;
    await this.session('userInfo', userInfo);
    return this.redirect('/');
  }
};
