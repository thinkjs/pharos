const fs = require('fs');
const path = require('path');
const semver = require('semver');
const cluster = require('cluster');
const {exec} = require('child_process');
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

  async putAction() {
    if (/^win/.test(process.platform)) {
      return this.fail('PLATFORM_NOT_SUPPORT');
    }

    const {step} = this.get();
    switch (step) {
      /** 下载文件 */
      case '1':
      default:
        return rq({uri: this.get('url')})
          .pipe(fs.createWriteStream(path.join(think.ROOT_PATH, 'www/latest.tar.gz')))
          .on('close', () => this.success())
          .on('error', err => this.fail(err));

      /** 解压覆盖，删除更新文件 */
      case '2':
        return exec(`
          cd ${think.ROOT_PATH}/www;
          tar zvxf latest.tar.gz;
          cp -r pharos/* ../;
          rm -rf pharos latest.tar.gz`, error => {
          if (error) {
            this.fail(error);
          }

          this.success();
        });

      /** 安装依赖 */
      case '3':
        const registry = think.config('registry') || 'https://registry.npm.taobao.org';
        return exec(`npm install --registry=${registry}`, error => {
          if (error) {
            this.fail(error);
          }

          this.success();
        });

      /** 重启服务 */
      case '4':
        if (cluster.isWorker) {
          this.success();
          setTimeout(() => {
            cluster.worker.kill();
            think.messenger.broadcast('restart');
          }, 200);
        }

        break;
    }
  }
};
