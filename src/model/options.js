module.exports = class extends think.Model {
  async getOptions(site_id = 0) {
    const ret = await this.where({site_id}).field('name, value').select();
    const opts = {};
    ret.forEach(({name, value}) => {
      opts[name] = value;
    });
    return opts;
  }

  async updateOptions(name, value, site_id = 0) {
    const data = think.isObject(name) ? think.extend({}, name) : {[name]: value};

    for (const key in data) {
      const value = data[key];
      const exist = await this.where({name: key, site_id}).count('name');
      if (exist) {
        await this.where({name: key, site_id}).update({value});
      } else {
        await this.add({name: key, value, site_id});
      }
    }

    return this.getOptions(site_id);
  }
};
