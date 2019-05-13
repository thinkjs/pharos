module.exports = class extends think.Model {
  addSite(data) {
    data.create_time = think.datetime();
    return this.add(data);
  }
}