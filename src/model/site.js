module.exports = class extends think.Model {
  get schema() {
    return {
      id: {
        type: 'INT(11)',
        primary: true,
        unique: true,
        autoIncrement: true
      },
      url: {
        type: 'VARCHAR(255)'
      },
      name: {
        type: 'VARCHAR(255)'
      }
    };
  }

  get relation() {
    return {
      user: {
        type: think.Model.MANY_TO_MANY,
        field: ['name', 'display_name', 'email', 'id']
      }
    };
  }

  afterAdd({id, user}, options) {
    if (!think.isArray(user)) {
      user = [user];
    }
    user = user.map(user_id => ({site_id: id, user_id}));

    return this.model('site_user').addMany(user);
  }

  addSite(data) {
    data.create_time = think.datetime();
    return this.add(data);
  }
};
