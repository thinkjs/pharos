const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  async getAction() {
    const {page, pagesize, keyword} = this.get();

    let data;
    if (this.id) {
      const pk = await this.modelInstance.pk;
      data = await this.modelInstance.where({[pk]: this.id}).find();
      return this.success(data);
    } else if (keyword) {
      this.modelInstance = this.modelInstance.where({
        name: ['like', '%' + keyword + '%'],
        email: ['like', '%' + keyword + '%'],
        display_name: ['like', '%' + keyword + '%'],
        _logic: 'OR'
      });
    }
    data = await this.modelInstance.page([page, pagesize]).countSelect();
    return this.success(data);
  }

  async postAction() {
    const data = this.post();
    const insertId = await this.modelInstance.addUser(data, this.ctx.ip);

    if (insertId.type === 'exist') {
      return this.fail('USER_EXIST');
    }

    if (insertId.type === 'add') {
      const userModel = this.model('user');
      const userInfo = await userModel.where({
        name: data.name,
        email: data.email,
        _logic: 'OR'
      }).field('id,email,name,password,display_name,status').find();
      delete userInfo.password;
      await this.session('userInfo', userInfo);
      return this.success(userInfo);
    }

  }

  async putAction() {

    let data = this.get();
    for (const i in data) {
      if (!data[i]) {
        delete data[i];
      }
    }

    data.id = this.id;
    data = await this.modelInstance.updateUser(data);
    return this.success(data);
  }

  async deleteAction() {
    const data = this.post();

    data.id = this.id;
    const affectedRows = await this.modelInstance.deleteUser(data);
    return this.success(affectedRows);
  }
};
