module.exports = class extends think.Logic {
  __before() {
    if (!this.isCli) {
      return this.ctx.throw(404);
    }
  }
};
