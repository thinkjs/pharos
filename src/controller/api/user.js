const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  async getAction() {
    const { page, pagesize, keyword } = this.get();

    let data;
    if (this.id) {
      const pk = await this.modelInstance.pk;
      data = await this.modelInstance.where({ [pk]: this.id }).find();
      return this.success(data);
    } else if (keyword) {
      this.modelInstance = this.modelInstance.field('id,name,display_name').where({
        name: ['like', '%' + keyword + '%'],
        email: ['like', '%' + keyword + '%'],
        display_name: ['like', '%' + keyword + '%'],
        _logic: 'OR'
      });
      data = await this.modelInstance.page([1, 5]).countSelect();
      return this.success(data);
    }

    const selectUser = this.modelInstance.page([page, pagesize]);
    const isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status)
    if (!isSuperAdmin) {
      selectUser.field('id,name,display_name');
    }
    data = await selectUser.countSelect();
    return this.success(data);
  }

  async postAction() {
    const data = this.post();
    const insertId = await this.modelInstance.addUser(data, this.ctx.ip);

    if (insertId.type === 'exist') {
      return this.fail('USER_EXIST');
    }

    return this.success({ id: insertId });
  }

  async putAction() {
    if (!this.id) {
      return this.fail('MISS USER ID');
    }

    let data = this.post();
    for (const i in data) {
      if (!data[i]) {
        delete data[i];
      }
    }

    data.id = this.id;
    data = await this.modelInstance.updateUser(data);
    return this.success(data);
  }
};
