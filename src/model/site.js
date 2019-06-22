module.exports = class extends think.Model {
  get relation() {
    return {
      user: {
        type: think.Model.MANY_TO_MANY,
        field: ['name', 'display_name', 'email', 'id']
      }
    };
  }

  addSite(data) {
    data.create_time = think.datetime();
    return this.add(data);
  }
}