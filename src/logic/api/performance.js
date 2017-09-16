module.exports = class extends think.Logic {
  getAction() {
    this.rules = {
      title: {
        required: true,
        string: true
      },
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
