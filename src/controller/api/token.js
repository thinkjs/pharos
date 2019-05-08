const SVGCaptcha = require('think-svg-captcha');
const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  async getAction() {
    const captcha = new SVGCaptcha({
      fontSize: 62
    });
    const {data, text} = captcha.create();

    const TEN_MINS = 10 * 60 * 1000;
    const name = `pharos_${think.uuid()}`;
    await this.cache(name, text, {timeout: TEN_MINS});
    this.cookie('captcha', name, {maxAge: TEN_MINS});

    this.ctx.type = 'image/svg+xml';
    this.ctx.body = data;
    return true;
  }

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
