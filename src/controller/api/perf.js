const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
  constructor(...args) {
    super(...args);
    this.modelPerf = this.model('performance');
    this.modelArch = this.model('performance_archive');
  }

  async getAction() {
    const {metric} = this.get();
    if (typeof this[`get${metric}`] === 'function') {
      return this[`get${metric}`]();
    }
    return this.success();
  }

  /** 某 site_id 某 site_page_id 所有 perf 因素某段日期的平均时间 */
  async getallPerfAvgConsumeTime() {
    const {site_id, site_page_id, start_time, end_time} = this.get();

    const PERFS = ['loadPage', 'domReady', 'redirect', 'lookupDomain', 'ttfb', 'request', 'loadEvent', 'appcache', 'unloadEvent', 'connect'];
    const where = {site_id, start_time, end_time};
    // eslint-disable-next-line camelcase
    if (site_page_id) { where.site_page_id = site_page_id }
    let data = await this.modelArch.where(
      Object.assign({}, where, {index_name: ['IN', PERFS]})
    ).field('index_name as perf_name, index_value as perf_value').select();
    if (data.length === PERFS.length) {
      return this.success(data);
    }

    const sql = `SELECT 
      ${PERFS.map(perf => `AVG(${perf}) AS ${perf}`).join()} 
    FROM ${this.modelPerf.tablePrefix}performance
    WHERE 
      site_id=${site_id} AND 
      create_time>="${start_time}" AND 
      create_time<"${end_time}"
      ${site_page_id ? ` AND site_page_id=${site_page_id}` : ''}
    `;
    data = await this.modelPerf.query(sql);
    if (think.isEmpty(data)) {
      return this.success(PERFS.map(perf => ({perf_name: perf, perf_value: null})));
    }

    data = PERFS.map(perf => ({
      site_id,
      site_page_id,
      index_name: perf,
      index_value: data[0][perf],
      index_count: 0,
      start_time: start_time,
      end_time: end_time,
      archive_time: think.datetime()
    }));
    await this.modelArch.addMany(data);
    return this.success(data.map(({index_name, index_value}) => ({
      perf_name: index_name,
      perf_value: index_value
    })));
  }

  /** 某 site_id 某 site_page_id 某 perf 因素各时段个数 */
  async getperfDistributionTime() {
    const {site_id, site_page_id, start_time, end_time} = this.get();
    const perf_name = this.get('perf_name').split(/\s*,\s*/);
    const where = {site_id, start_time, end_time};
    if (site_page_id) { where.site_page_id = site_page_id }
    let distributionArea = [
      [0, '0.1s以内'],
      [100, '0.1s-0.25s'],
      [250, '0.25-0.5s'],
      [500, '0.5-1s'],
      [1000, '1-2s'],
      [2000, '2-3s'],
      [3000, '3-4s'],
      [4000, '4-5s'],
      [5000, '5-6s'],
      [6000, '6-7s']
    ];
    if (perf_name.length > 1) {
      distributionArea = distributionArea.concat([
        [7000, '7-8s'],
        [8000, '8-9s'],
        [9000, '9-10s'],
        [10000, '10-11s'],
        [11000, '11-12s'],
        [12000, '12-13s'],
        [13000, '13-14s'],
        [14000, '14-15s'],
        [15000, '15-16s'],
        [Number.MAX_SAFE_INTEGER, '16s以上']
      ]);
    }
    distributionArea = new Map(distributionArea);

    let data = await this.modelArch.where(
      Object.assign({}, where, {
        index_name: ['IN', perf_name.map(
          name => `${name}DistributionTime`
        )]
      })
    ).field('index_name as name, index_value as area, index_count as count').select();

    if (data.length === perf_name.length * distributionArea.length) {
      const obj = {};
      for (const item of data) {
        obj[item.name.slice(0, -16)][item.area] = item.count;
      }

      let result = {};
      for (const name of perf_name) {
        for (const area of distributionArea.keys()) {
          result[name].push({
            label: distributionArea.get(area),
            count: data[name] && data[name][area] ? data[name][area] : 0
          });
        }
      }
      if (perf_name.length === 1) {
        result = result[perf_name[0]];
      }
      return this.success(result);
    }

    let resultObj = {};
    for (const name of perf_name) {
      const distributionInterval = `ELT(
      INTERVAL(${name}, ${Array.from(distributionArea.keys())}), 
      ${Array.from(distributionArea.values()).map(label => `'${label}'`)}
    )`;
      const sql = `SELECT 
      site_id,
      site_page_id,
      ${distributionInterval} AS level,
      COUNT(id) AS cnt
    FROM
      ${this.modelPerf.tablePrefix}performance
    WHERE
      site_id = ${site_id} AND
      create_time >= "${start_time}" AND create_time < "${end_time}"
      ${site_page_id ? ` AND site_page_id=${site_page_id}` : ''}
    GROUP BY
      ${distributionInterval}
    `;
      data = await this.modelPerf.query(sql);
      data = new Map(data.map(item => [item.level, item]));
      const result = new Map();
      for (const areaName of distributionArea.keys()) {
        const area = distributionArea.get(areaName);
        result.set(areaName, {
          label: area,
          count: data.has(area) ? data.get(area).cnt : 0
        });
      }

      resultObj[name] = Array.from(result.values());
      await this.modelArch.addMany(
        Array.from(result.keys()).map(area => ({
          site_id,
          site_page_id,
          index_name: `${perf_name}DistributionTime`,
          index_value: area,
          index_count: result.get(area).count,
          start_time,
          end_time,
          archive_time: think.datetime()
        }))
      );
    }
    if (perf_name.length === 1) {
      resultObj = resultObj[perf_name[0]];
    }
    return this.success(resultObj);
  }

  /** 某 site_id 某 site_page_Id 某 perf 因素不同操作系统的平均时间 */
  async getperfAvgTimeByOS() {
    const {site_id, site_page_id, start_time, end_time} = this.get(); const perf_name = this.get('perf_name').split(/\s*,\s*/);
    const where = {site_id, start_time, end_time};
    if (site_page_id) { where.site_page_id = site_page_id }

    let data = await this.modelArch.where(
      Object.assign({}, where, {
        index_name: 'perfAvgTimeByOS',
        vdo1: ['IN', perf_name]
      })
    ).field('vdo1 as perf, vdo2 as os_name, vdo3 as os_version, CONCAT(vdo2, \'/\', vdo3) as os, index_value as avg, index_count as count').select();

    if (!think.isEmpty(data)) {
      let obj = {};
      for (const item of data) {
        if (!obj[item.perf]) {
          obj[item.perf] = [];
        }
        obj[item.perf].push(item);
      }
      if (perf_name.length === 1) {
        obj = obj[perf_name[0]];
      }
      return this.success(obj);
    }

    const sql = `SELECT 
      site_id,
      site_page_id,
      ${perf_name.map(name => `AVG(${name}) AS ${name}`)},
      COUNT(*) AS cnt,
      os AS os_name,
      os_version,
      CONCAT(os, '/', os_version) AS os
    FROM
      ${this.modelPerf.tablePrefix}performance
    LEFT JOIN ${this.modelPerf.tablePrefix}visit_user 
    ON ${this.modelPerf.tablePrefix}visit_user.id = ${this.modelPerf.tablePrefix}performance.visit_user_id
    WHERE
      create_time >= "${start_time}" AND create_time < "${end_time}" AND domReady < 15000
    GROUP BY
      os
    HAVING cnt > 50;
    `;
    data = await this.modelPerf.query(sql);
    const insertData = [];
    let result = {};
    for (const name of perf_name) {
      if (!result[name]) {
        result[name] = [];
      }
      for (const item of data) {
        insertData.push({
          site_id,
          site_page_id,
          index_name: 'perfAvgTimeByOS',
          index_value: item[name],
          index_count: item.cnt,
          vdo1: name,
          vdo2: item.os_name,
          vdo3: item.os_version,
          start_time,
          end_time,
          archive_time: think.datetime()
        });
        result[name].push({
          perf: name,
          os_name: item.os_name,
          os_version: item.os_version,
          os: [item.os_name, item.os_version].join('/'),
          avg: item[name],
          count: item.cnt
        });
      }
    }
    if (insertData.length) {
      await this.modelArch.addMany(insertData);
    }
    if (perf_name.length === 1) {
      result = result[perf_name[0]];
    }
    return this.success(result);
  }

  /** 某 site_id 某 site_page_Id 某 perf 因素不同省份的平均时间 */
  async getperfAvgTimeByProvince() {
    const {site_id, site_page_id, start_time, end_time} = this.get(); const perf_name = this.get('perf_name').split(/\s*,\s*/);
    const where = {site_id, start_time, end_time};
    if (site_page_id) { where.site_page_id = site_page_id }

    let data = await this.modelArch.where(
      Object.assign({}, where, {
        index_name: 'perfAvgTimeByProvince',
        vdo1: ['IN', perf_name]
      })
    ).field('vdo1 as perf, vdo2 as province, index_value as avg, index_count as count').select();

    if (!think.isEmpty(data)) {
      let obj = {};
      for (const item of data) {
        if (!obj[item.perf]) {
          obj[item.perf] = [];
        }
        obj[item.perf].push(item);
      }
      if (perf_name.length === 1) {
        obj = obj[perf_name[0]];
      }
      return this.success(obj);
    }

    const sql = `SELECT 
    site_id,
    site_page_id,
    ${perf_name.map(name => `AVG(${name}) AS ${name}`)},
    COUNT(*) AS cnt,
    location_province AS province
  FROM
    ${this.modelPerf.tablePrefix}performance
  LEFT JOIN ${this.modelPerf.tablePrefix}visit_user 
  ON ${this.modelPerf.tablePrefix}visit_user.id = ${this.modelPerf.tablePrefix}performance.visit_user_id
  WHERE
    create_time >= "${start_time}" AND create_time < "${end_time}" AND domReady < 15000
  GROUP BY
    province
  HAVING cnt > 2;
  `;
    data = await this.modelPerf.query(sql);
    const insertData = [];
    let result = {};
    for (const name of perf_name) {
      if (!result[name]) {
        result[name] = [];
      }
      for (const item of data) {
        insertData.push({
          site_id,
          site_page_id,
          index_name: 'perfAvgTimeByProvince',
          index_value: item[name],
          index_count: item.cnt,
          vdo1: name,
          vdo2: item.province,
          start_time,
          end_time,
          archive_time: think.datetime()
        });
        result[name].push({
          perf: name,
          province: item.province,
          avg: item[name],
          count: item.cnt
        });
      }
    }
    if (insertData.length) {
      await this.modelArch.addMany(insertData);
    }
    if (perf_name.length === 1) {
      result = result[perf_name[0]];
    }
    return this.success(result);
  }
};
