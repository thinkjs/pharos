module.exports = class extends think.Model {
  get relation() {
    return {
      visit_url: think.Model.BELONG_TO,
      visit_user: think.Model.BELONG_TO
    };
  }
};
