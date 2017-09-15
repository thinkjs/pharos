/**
 * basic use
 * 
 * const ipServiceInstance = new IPService(path.join(
 *   think.ROOT_PATH, 'www/ip.txt'
 * ));
 * console.log(ipServiceInstance.find('218.30.116.9'));
 */
const ip = require('ip');
const fs = require('fs');

module.exports = class {
  constructor(file) {
    const IPDATA = fs.readFileSync(file, 'utf-8').split('\n');
    const IPMAP = [];

    for (let i = 0; i < IPDATA.length; i++) {
      const item = IPDATA[i].split(/\t/);

      const ipnum = parseInt(item[0].trim());
      const country = item[2].trim();
      let province = item[3].trim();
      let town = item[4].trim();
      let district = item[5].trim();
      let street = item[6].trim();
      let carrier = item[7].split('\r')[0];

      if (province == '未知') {
        province = '';
      }
      if (town == '未知') {
        town = '';
      }
      if (district == '未知') {
        district = '';
      }
      if (street == '未知') {
        street = '';
      }
      if (carrier == '未知') {
        carrier = '';
      }

      IPMAP.push({ ipnum, country, province, town, district, street, carrier });
    }
    this.IPMAP = IPMAP;
  }

  search(value, startIndex = 0, endIndex = this.IPMAP.length) {
    const midIndex = Math.floor((startIndex + endIndex) / 2);
    const midVal = this.IPMAP[midIndex].ipnum;

    if (value >= midVal && value < this.IPMAP[midIndex + 1].ipnum) {
      return this.IPMAP[midIndex + 1];
    } else if (midVal > value) {
      return this.search(value, startIndex, endIndex - 1);
    } else {
      return this.search(value, midIndex + 1, endIndex);
    }
  }

  find(val) {
    return this.search(ip.toLong(val));
  }
};
