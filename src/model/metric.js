module.exports = class extends think.Model {
    addMetric(data) {
      data.create_time = think.datetime();
      return this.add(data);
    }
}