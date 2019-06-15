const BaseRest = require('../../rest.js');

const FIVE_MINS = 5 * 60 * 1000;
const ONE_HOUR = FIVE_MINS * 12;
const ONE_DAY = ONE_HOUR * 24;
const BETWEEN = {
  day: {
    delta: ONE_DAY,
    format: 'YYYY-MM-DD',
    transform: 'YYYY-MM-DD 00:00:00'
  },
  hour: {
    delta: ONE_HOUR,
    format: 'MM-DD HH:00',
    transform: 'YYYY-MM-DD HH:00:00'
  },
  mins: {
    delta: FIVE_MINS,
    format: 'MM-DD HH:mm',
    transform: 'YYYY-MM-DD HH:mm:00'
  }
};
class Base extends BaseRest {
  map(arr, keys, fn = _ => { }) {
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
        data[key] = { ...keyObj, ...obj };
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

  // 获取监控项的监控因子
  async getFactors(metric_id) {
    const metric = await this.model('metric')
          .where({id: metric_id})
          .field('k1, k1_display_name, k2, k2_display_name, k3, k3_display_name, k4, k4_display_name, k5, k5_display_name').select();
    const result = [];
    const types = Object.keys(metric[0]).filter(type => !type.includes('display_name'));
    types.map(type => {
      if (metric[0][type]) {
        result.push({
          type,
          name: metric[0][type],
          display_name: metric[0][`${type}_display_name`]
        });
      }
    });
    return result;
  }

  async getCustoms(site_id, metric_id, metric = 'k1') {
    const result = {};
    const customs = await this.model('metric').where({site_id, id: metric_id, }).select();
    if (think.isEmpty(customs)) {
      return result;
    }
    result.length = customs.length;
    for (let i = 0; i < customs.length; i++) {
      result.name = customs[i][`${metric}_display_name`];
    }
      
      // const { id, name, display_name, description, k1, k1_display_name, k2, k2_display_name, k3,
      //   k3_display_name, k4, k4_display_name, k5, k5_display_name, type } = customs[i];
      // result[id] = name;
      // result[name] = id;
    return result;
  }

  async groupWithCustom(site_id, metric_id, metric, data, cb) {
    if (think.isEmpty(data)) {
      return [];
    }
    
    const customs = await this.getCustoms(site_id, metric_id, metric);
    const result = {
      data: [],
      name: customs.name
    };
    for (let i = 0; i < data.length; i++) {
      result.data.push(data[i]);
    }
    return cb(result);
  }

  avg({ time, count }, digit = 2) {
    const fixed = Math.pow(10, digit);
    return Math.round(time / count * fixed) / fixed;
  }

  generateCates(start_time, end_time, type = 'day', format) {
    const { delta, transform } = BETWEEN[type] || BETWEEN['day'];
    format = format || BETWEEN[type].format;
    const startTime = new Date(think.datetime(new Date(start_time), transform)).getTime();
    const endTime = new Date(think.datetime(new Date(end_time), transform)).getTime();

    const times = [];
    for (let time = startTime; time < endTime; time += delta) {
      times.push(think.datetime(new Date(time), format));
    }
    return times;
  }
};

Base.BETWEEN = BETWEEN;
module.exports = Base;
