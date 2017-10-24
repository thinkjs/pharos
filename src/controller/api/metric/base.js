const BaseRest = require('../../rest.js');
module.exports = class extends BaseRest {
  map(arr, keys, fn = _ => {}) {
    const result = [];
    function mapFilter(obj, keys, info = {}, fn) {
      if (keys.length) {
        for (const i in obj) {
          info[keys[0]] = i;
          mapFilter(obj[i], keys.slice(1), info, fn);
        }
      } else {
        const data = {...info, ...obj};
        if (fn(data) === false) {
          return;
        };
        result.push(data);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      mapFilter(arr[i], keys, {}, fn);
    }
    return result;
  }

  groupWithPerf(data, cb) {
    if (think.isEmpty(data)) {
      return [];
    }

    const result = {};
    for (let i = 0; i < data.length; i++) {
      const perf = global.perfs[data[i].perf];
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
};
