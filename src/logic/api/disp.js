module.exports = class extends think.Logic {
  /**
   * @api {GET} /disp 添加监控数据
   * @apiGroup Performance
   * @apiVersion  0.0.1
   *
   * @apiParam  {String}  screen  屏幕分辨率
   * @apiParam  {String}  info  接口数据
   * @apiParam  {Int}     site_id 网站ID
   */
  async getAction() {
    const {site_id} = this.get();
    const site = await this.model('site').where({id: site_id}).find();
    if (think.isEmpty(site)) {
      return this.fail('SITE_EMPTY');
    }

    this.rules = {
      screen: {
        required: true,
        regexp: /\d+x\d+/
      },
      info: {
        required: true,
        json: true
      },
      site_id: {
        required: true,
        int: true
      }
    };
  }
};
