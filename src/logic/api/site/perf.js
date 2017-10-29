module.exports = class extends think.Logic {
  async __before() {
    const {site_id} = this.get();
    if (!site_id) {
      return this.fail('SITE_ID MISS');
    }

    const userInfo = await this.session('userInfo') || {};
    const isSiteUser = await this.model('site_user').where({
      site_id,
      user_id: userInfo.id
    }).find();
    if (think.isEmpty(isSiteUser)) {
      return this.fail('PERMISSION_DENIED');
    }
  }
  /**
   * @api {GET} /site/:id/perf 获取网站性能指标列表
   * @apiGroup Site
   * @apiVersion  0.0.1
   */
  getAction() {

  }

  /**
   * @api {POST} /site/:id/perf 为网站添加性能指标字段
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {String}  name  性能指标名称
   * @apiParam  {String}  description  性能指标描述
   */ 
  postAction() {
    this.rules = {
      name: {
        required: true,
        alphaDash: true,
        length: {min: 4, max: 20}
      },
      description: {
        length: {max: 150}
      }
    };
  }

  /**
   * @api {POST} /site/:id/perf/:id 修改性能指标字段
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {String}  name  性能指标名称
   * @apiParam  {String}  description  性能指标描述
   */ 
  putAction() {
    this.rules = {
      name: {
        alphaDash: true,
        length: {min: 4, max: 20}
      },
      description: {
        length: {max: 150}
      }
    };
  }

  /**
   * @api {POST} /site/:id/perf/:id 为网站删除性能指标字段
   * @apiGroup Site
   * @apiVersion 0.0.1
   */ 
  deleteAction() {

  }
};
