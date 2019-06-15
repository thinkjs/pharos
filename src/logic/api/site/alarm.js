const Base = require('./base');
const AppError = require('../../../extend/errors');
module.exports = class extends Base {
  async __before(...args) {
    await Base.prototype.__before.call(this, ...args);
    if (!this.isAdmin) {
      return this.fail(AppError.PERMISSION_DENIED);
    }
  }
  /**
   * @api {GET} /site/:id/alarm 获取网站已有报警列表
   * @apiGroup Site
   * @apiVersion  0.0.1
   * 
   * @apiParam  {String}  [page]  页数
   * @apiParam  {String}  [pagesize]  分页大小
   */
  async getAction() {
    const { site_id } = this.get();

    if (!site_id) {
        return this.fail('SITE ID MISS');
    }
    const sites = await this.model('site').where({id: site_id}).select();
    if (think.isEmpty(sites)) {
        return this.fail('SITE NOT FOUND');
    }
    this.rules = {
      page: {
        int: true,
        default: 1
      },
      pagesize: {
        int: true,
        default: 10
      }
    };
  }
  /**
   * @api {POST} /site/:id/alarm 为网站添加报警
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {Int}  metric_id  监控项ID
   * @apiParam  {String}  name  报警名称
   * @apiParam  {JSON}  conditions  报警规则
   */
  async postAction() {
    const { site_id } = this.get();
    const { metric_id } = this.post();
    if (!site_id) {
      return this.fail('SITE ID MISS');
    }
    const sites = await this.model('site').where({id: site_id}).select();
    if (think.isEmpty(sites)) {
      return this.fail('SITE NOT FOUND');
    }

    const metrics = await this.model('metric').where({id: metric_id}).select();
    if (think.isEmpty(metrics)) {
      return this.fail('METRIC NOT FOUND');
    }

    this.rules = {
      name: {
        required: true,
        string: true
      },
      metric_id: {
        int: true,
        required: true
      },
      conditions: {
        json: true
      }
    }
  }

  /**
   * @api {PUT} /site/:id/alarm/:alarm_id 修改网站报警
   * @apiGroup Site
   * @apiVersion 0.0.1
   * 
   * @apiParam  {Int}  [metric_id]  监控项ID
   * @apiParam  {String}  [name]  报警名称
   * @apiParam  {JSON}  [conditions]  报警规则
   */
  async putAction() {
    if (!this.id) {
      return this.fail();
    }

    const { site_id } = this.get();
    const { metric_id } = this.post();
    if (!site_id) {
      return this.fail('SITE ID MISS');
    }
    const sites = await this.model('site').where({id: site_id}).select();
    if (think.isEmpty(sites)) {
      return this.fail('SITE NOT FOUND');
    }

    const metrics = await this.model('metric').where({id: metric_id}).select();
    if (think.isEmpty(metrics)) {
      return this.fail('METRIC NOT FOUND');
    }

    const alarms = await this.model('site_alarm').where({id: this.id}).select();
    if (think.isEmpty(alarms)) {
      return this.fail('ALARM NOT FOUND');
    }

    this.rules = {
      name: {
        string: true
      },
      metric_id: {
        int: true
      },
      conditions: {
        json: true
      }
    };
  }

  /**
   * @api {DELETE} /site/:id/alarm/:alarm_id 为网站删除报警
   * @apiGroup Site
   * @apiVersion 0.0.1
   */
  async deleteAction() {
    if (!this.id) {
      return this.fail();
    }
    const alarms = await this.model('site_alarm').where({id: this.id}).select();
    if (think.isEmpty(alarms)) {
      return this.fail('ALARM NOT FOUND');
    }
  }
};
