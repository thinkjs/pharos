module.exports = class extends think.Logic {
  postAction() {
    if (!this.isCli) return this.fail();
  }
};
