const BaseRest = require('../../rest.js');
module.exports = class extends BaseRest {
  map(arr, keys, fn = _ => {}) {
    const data = {};
    function mapReduce(obj, keys, info = []) {
      if (keys.length) {
        for (const i in obj) {
          info.push([keys[0], i]);
          mapReduce(obj[i], keys.slice(1), info);
        }
        return;
      }

      const keyObj = {};
      const key = info.map(([k, v]) => {
        keyObj[k] = v;
        return v;
      }).join('/');

      if (data[key]) {
        for (var i in obj) {
          data[key][i] += obj[i];
        }
      } else {
        data[key] = {...keyObj, ...obj};
      }
    }

    for (let i = 0; i < arr.length; i++) {
      mapReduce(arr[i], keys, []);
    }

    const result = [];
    for (var i in data) {
      const item = data[i];
      if (fn(item) === false) {
        continue;
      }
      result.push(item);
    }

    return result;
  }

  async groupWithPerf(site_id, data, cb) {
    if (think.isEmpty(data)) {
      return [];
    }

    const result = {};
    const perfs = await this.getPerfs(site_id);
    for (let i = 0; i < data.length; i++) {
      const perf = perfs[data[i].perf];
      if (!Array.isArray(result[perf])) {
        result[perf] = [];
      }
      result[perf].push(data[i]);
    }

    const output = [];
    for (const perf in result) {
      output.push({
        name: perf,
        data: cb(result[perf])
      });
    }

    return output;
  }

  avg({time, count}, digit = 2) {
    const fixed = Math.pow(10, digit);
    return Math.round(time / count * fixed) / fixed;
  }

  async addData(data, whereKeys = []) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const where = whereKeys.reduce((w, k) => {
        w[k] = item[k];
        return w;
      }, {});

      const store = await this.modelInstance.where(where).find();
      if (think.isEmpty(store)) {
        result.push(await this.modelInstance.add(item));
      } else {
        item.time += store.time;
        item.count += store.count;
        result.push(await this.modelInstance.where(where).update(item));
      }
    }
    return result;
  }
};
