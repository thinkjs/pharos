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
    for (const i in data) {
      const item = data[i];
      const where = {};
      for (const key of whereKeys) {
        where[key] = item[key];
      }

      const store = await this.modelInstance.where(where).find();
      if (think.isEmpty(store)) {
        result.push(await this.modelInstance.add(item));
        continue;
      }

      item.time += store.time;
      item.count += store.count;
      result.push(await this.modelInstance.where(where).update(item));
    }
    return result;
  }

  async dataCollection(metric, indexs) {
    const startTime = Date.now();
    const createTime = think.datetime(Date.now(), 'YYYY-MM-DD HH:mm:00');
    think.logger.info('crontab', metric, createTime);

    const gatherData = await think.messenger.map(metric);
    const gatherDataTime = Date.now() - startTime;
    think.logger.debug(`${metric} get gather data costs ${gatherDataTime}ms`);

    const gatherMetric = {};
    for (let i = 0; i < gatherData.length; i++) {
      const data = gatherData[i];
      for (const item in data) {
        if (!gatherMetric[item]) {
          data[item].create_time = createTime;
          gatherMetric[item] = data[item];
        }

        gatherMetric[item].time += data[item].time;
        gatherMetric[item].count += data[item].count;
      }
    }

    if (think.isEmpty(gatherMetric)) {
      return think.logger.warn(`${metric} is empty`);
    }
    const handleDataTime = Date.now() - startTime - gatherDataTime;
    think.logger.debug(`${metric} handle data costs ${handleDataTime}ms`);

    await this.addData(gatherMetric, ['create_time', ...indexs]);
    const addDataTime = Date.now() - startTime - gatherDataTime - handleDataTime;
    think.logger.debug(`${metric} add data costs ${addDataTime}ms`);

    think.logger.info(`${metric} crontab time: ${Date.now() - startTime}ms`);
    return this.success();
  }
};
