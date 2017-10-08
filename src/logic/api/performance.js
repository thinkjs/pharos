module.exports = class extends think.Logic {
  /**
   * @api {GET} /performance 添加监控数据
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {String}  title  网站标题
   * @apiParam  {String}  screen  屏幕分辨率
   * @apiParam  {String}  info  接口数据
   * @apiParam  {Int}     site_id 网站ID
   */  
  getAction() {
    this.rules = {
      title: {
        required: true,
        string: true
      },
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
