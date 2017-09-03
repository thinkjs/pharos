module.exports = class extends think.Logic {
  getAction() {
    this.rules = {
      screen: {
        required: true,
        regexp: /\d+x\d+/
      },
      info: {
        required: true,
        json: true
      }
    };
  }
};
