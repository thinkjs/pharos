const Base = require('../base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('site_alarm');
  }

  getAction() {
    return this.success({
      page: 1,
      totalPages: 1,
      pageSize: 10,
      data: [
        {
          id: 1,
          name: '报警测试数据',
          metric: {
            id: 3,
            name: '报错监控'
          },
          conditions: {
            count: 10,
            expression: '>',
            limit: 0.3
          }
        }
      ]
    })
  }
};
