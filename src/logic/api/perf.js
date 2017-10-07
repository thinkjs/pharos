module.exports = class extends think.Logic {
  /**
   * @api {GET} /perf?metric=allPerfAvgConsumeTime 获取某段时间所有指标的平均值
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */    
  /**
   * @api {GET} /perf?metric=perfDistributionTime 某性能指标耗时分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  perf_name perf 名称
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */
  /**
   * @api {GET} /perf?metric=perfAvgTimeByOS 某性能指标不同系统的耗时分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  perf_name perf 名称
   * @apiParam  {String}  start_time  起始时间
   * @apiParam  {String}  end_time  终止时间
   */   
  /**
   * @api {GET} /perf?metric=perfAvgTimeByProvince 某性能指标不同省份的耗时分布
   * @apiGroup Performance
   * @apiVersion  0.0.1
   * 
   * @apiParam  {Int}     site_id 网站ID
   * @apiParam  {Int}     site_page_id 网页ID
   * @apiParam  {String}  perf_name perf 名称
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
      metric: {
        required: true,
        string: true
      }
    };
  }
};
