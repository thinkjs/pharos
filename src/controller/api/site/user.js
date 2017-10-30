const Base = require('../base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('user');
  }

  async getAction() {
    const {site_id} = this.get();
    const users = await this.modelInstance.join({
      table: 'site_user',
      join: 'left',
      on: ['id', 'user_id']
    }).field('site_id, user_id as id, name, email, display_name')
      .where({site_id})
      .order('id')
      .select();
    return this.success(users);
  }

  async postAction() {
    const {site_id} = this.get();
    if (!this.id) {
      return this.fail('PARAMS_ERROR');
    }

    const user_ids = this.id.split(/\s*,\s*/);
    const user = await this.modelInstance
      .where({id: ['IN', user_ids]})
      .select();

    if (user.length !== user_ids.length) {
      return this.fail('USER_NOT_EXIST');
    }

    for (const user_id of user_ids) {
      await this.model('site_user')
        .where({site_id, user_id})
        .thenAdd({site_id, user_id});
    }
    return this.success();
  }

  async deleteAction() {
    const {site_id} = this.get();
    if (!this.id) {
      return this.fail('PARAMS_ERROR');
    }

    const user_ids = this.id.split(/\s*,\s*/);
    const result = await this.model('site_user').where({
      site_id,
      user_id: ['IN', user_ids]
    }).delete();
    return this.success(result);
  }
};
