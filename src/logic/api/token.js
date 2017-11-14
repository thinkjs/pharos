module.exports = class extends think.Logic {
  /**
   * @api {POST} /token 用户登录
   * @apiGroup User
   * @apiVersion 0.0.1
   *
   * @apiParam  {String}  credential  用户名或者密码
   * @apiParam  {String}  password  用户密码
   * @apiParam  {String}  captcha 验证码
   */
  async postAction() {
    const captchaText = this.post('captcha');
    if (!captchaText) {
      return this.fail('PLEASE_INPUT_CAPTCHA');
    }

    const captchaName = this.cookie('captcha');
    if (!captchaName) {
      return this.fail('CAPTCHA_ERROR');
    }

    const captchaAns = await this.cache(captchaName);
    if (!captchaAns || captchaText.toLowerCase() !== captchaAns.toLowerCase()) {
      return this.fail('CAPTCHA_ERROR');
    }

    this.rules = {
      credential: {
        required: true,
        string: true
      },
      password: {
        required: true,
        string: true,
        length: {min: 8, max: 20}
      }
    };
  }

  /**
   * @api {DELETE} /token 用户登出
   * @apiGroup User
   * @apiVersion 0.0.1
   */
  deleteAction() {

  }
};
