const fs = require('fs');
const path = require('path');
const tables = [
  'site',
  'user',
  'site_user',
  'site_page',
  'options',
  'perf'
];
module.exports = class extends think.Service {
  constructor(ip) {
    super(ip);
    this.ip = ip;
  }

  get dbConfig() {
    const type = think.config('model.type');
    return think.config(`model.${type}`);
  }

  set dbConfig(data) {
    think.config('model.type', 'mysql');
    think.config(`model.mysql`, data);
  }

  get installed() {
    return global.isInstalled;
  }

  set installed(val) {
    if (think.config('workers') !== 1) {
      think.messenger.broadcast('install', val);
    }
    global.isInstalled = val;
  }

  getModel(name) {
    if (name === true) {
      name = '';
    }
    return think.model(name, this.dbConfig);
  }

  async insertData(title, site_url) {
    let model = this.getModel(true);
    const dbConfig = this.dbConfig;
    const dbExist = await model.query(
      'SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA`= \'' +
      dbConfig.database + '\''
    );
    if (think.isEmpty(dbExist)) {
      await model.query('CREATE DATABASE `' + dbConfig.database + '`').catch(() => {});
    }

    const dbFile = path.join(think.ROOT_PATH, 'pharos.sql');
    if (!think.isFile(dbFile)) {
      return Promise.reject(
        new Error('数据库文件（pharos.sql）不存在，请重新下载')
      );
    }

    let content = fs.readFileSync(dbFile, 'utf8');
    content = content.split('\n').filter(item => {
      item = item.trim();
      const ignoreList = ['#', 'LOCK', 'UNLOCK'];
      for (const it of ignoreList) {
        if (item.indexOf(it) === 0) {
          return false;
        }
      }
      return true;
    }).join(' ');
    content = content.replace(/\/\*.*?\*\//g, '').replace(/ph_/g, dbConfig.prefix || '');
    // 导入数据
    model = this.getModel(true);
    content = content.split(';');
    try {
      for (let item of content) {
        item = item.trim();
        if (item) {
          think.logger.info(item);
          await model.query(item);
        }
      }
    } catch (e) {
      think.logger.error(e);
      return Promise.reject(new Error('数据表导入失败，请在控制台下查看具体的错误信息，并在 GitHub 上发 issue。'));
    }

    const optionsModel = this.getModel('options');
    await optionsModel.addMany([
      {name: 'title', value: title, site_id: ''},
      {name: 'site_url', value: site_url, site_id: ''}
    ]);
  }

  async createAccount(name, email, password) {
    const model = this.getModel('user');
    const data = {
      name,
      password,
      email,
      display_name: name,
      status: global.ROLES.SUPER_ADMIN
    };
    await model.addUser(data, this.ip);
  }

  async saveSiteInfo({title, site_url, name, email, password}) {
    await this.insertData(title, site_url);
    await this.createAccount(name, email, password);
    this.installed = true;
  }

  async checkDbInfo(config) {
    const dbInstance = this.model('', config);
    return dbInstance.query('SELECT VERSION()').catch(() => {
      return Promise.reject(new Error('数据库信息有误'));
    });
  }

  async saveDbInfo(dbConfig) {
    const data = {
      mysql: dbConfig
    };
    const content = `exports.model = ${JSON.stringify(data, undefined, 4)};`;

    let dbConfigFile;
    try {
      const srcPath = path.join(think.ROOT_PATH, 'src/config');
      fs.statSync(srcPath);
      dbConfigFile = path.join(srcPath, 'adapter.development.js');
    } catch (e) {
      dbConfigFile = path.join(think.APP_PATH, '/config/adapter.production.js');
    }
    fs.writeFileSync(dbConfigFile, content);
    const config = this.dbConfig;
    for (var i in dbConfig) {
      config[i] = dbConfig[i];
    }
    this.dbConfig = config;
  }

  async checkInstalled() {
    const dbConfig = this.dbConfig;
    const {database, prefix} = dbConfig;
    const model = this.getModel(true);

    try {
      let existTables = await model.query(
        'SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA`=\'' +
        database + '\''
      );
      if (think.isEmpty(existTables)) {
        return false;
      }

      existTables = existTables.map(table => table.TABLE_NAME);
      const installed = tables.every(table => existTables.includes(prefix + table));
      if (installed) {
        this.installed = true;
      }
      return installed;
    } catch (e) {
      think.logger.error(e);
      this.installed = false;
      return false;
    }
  }
};
