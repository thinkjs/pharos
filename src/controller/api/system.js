// const fs = require('fs');
// const path = require('path');
// const semver = require('semver');
// const request = require('request');
// const cluster = require('cluster');
// const {exec} = require('child_process');
const pkg = require('../../../package.json');

const Base = require('./base');
module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('options');
  }

  async getAction() {
    const mysql = await this.modelInstance.query('SELECT VERSION() as version');
    const data = {
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      platform: process.platform,
      thinkjsVersion: think.version,
      pharosVersion: pkg.version,
      mysqlVersion: mysql[0].version
    };
    return this.success(data);
  }
};
