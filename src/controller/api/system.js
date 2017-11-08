// const fs = require('fs');
// const path = require('path');
const semver = require('semver');
// const cluster = require('cluster');
// const {exec} = require('child_process');
const rq = require('request-promise-native');
const pkg = require('../../../package.json');

const Base = require('./base');
const lastestUrl = 'https://api.github.com/repos/thinkjs/pharos/releases/latest';
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('options');
  }

  async getAction() {
    const update = {
      need: false,
      download: '',
      text: ''
    };
    try {
      const res = await rq(lastestUrl);
      const lastest = JSON.parse(res.body);
      if (!lastest.tag_name || !semver.gt(lastest.tag_name, pkg.version)) {
        throw new Error('Current version is new version now!');
      }

      update.need = lastest.tag_name;
      update.download = lastest.assets[0].browser_download_user;
      update.text = lastest.body;
    } catch (e) {
      think.logger.error(e);
    }
    const mysql = await this.modelInstance.query('SELECT VERSION() as version');
    const data = {
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      platform: process.platform,
      thinkjsVersion: think.version,
      pharosVersion: pkg.version,
      mysqlVersion: mysql[0].version,
      update
    };
    return this.success(data);
  }
};
