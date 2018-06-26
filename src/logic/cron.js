module.exports = class extends think.Logic {
  cleanAction() {
    if (!this.isCli) {
      return this.fail();
    }
  }
};
