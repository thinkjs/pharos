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
const parseUnknow = text => text === '未知' ? '' : text;

module.exports = class {
  constructor(file) {
    const IPDATA = fs.readFileSync(file, 'utf-8').split('\n');
    const IPMAP = [];

    for (let i = 0; i < IPDATA.length; i++) {
      const item = IPDATA[i].split(/\t/);
      const ipnum = parseInt(item[0].trim());
      const country = parseUnknow(item[2].trim());
      const province = parseUnknow(item[3].trim());
      const town = parseUnknow(item[4].trim());
      const district = parseUnknow(item[5].trim());
      const street = parseUnknow(item[6].trim());
      const carrier = parseUnknow(item[7].split('\r')[0]);

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
