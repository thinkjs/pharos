const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  async postAction() {
    const data = this.post();
    const insertId = await this.modelInstance.addUser(data, this.ip());

    if (insertId.type === 'exist') {
      return this.fail('USER_EXIST');
    }

    return this.success({id: insertId});
  }
};
