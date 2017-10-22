const Base = require('./base');
module.exports = class extends Base {
  /**
   * @api {GET} /metric/consume_time 获取某段时间所有指标的平均值
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */    
  /**
   * @api {GET} /metric/consume_time?type=interval 性能耗时按照耗时区间分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */
  /**
   * @api {GET} /metric/consume_time?type=hour  性能耗时按照小时分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */   
  /**
   * @api {GET} /metric/consume_time?type=day 性能耗时按照日期分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */     

  getAction() {
    this.rules = {
      site_id: {
        required: true,
        int: true
      },
      site_page_id: {
        int: true
      },
      start_time: {
        required: true
      },
      end_time: {
        required: true
      },
      type: {
        in: ['interval', 'hour', 'day']
      }
    };
  }
};
