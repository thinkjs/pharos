const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display('index_index');
  }

  async installAction() {
    const step = parseInt(this.query('step'));
    const install = think.service('install', this.ip);

    this.assign({step});
    let message;
    if (this.isGet) {
      if (global.isInstalled) {
        return this.redirect('/');
      }

      const dbConfig = install.dbConfig;
      const isDBConfig = think.isObject(dbConfig) && ['host', 'database', 'user', 'password'].every(k => dbConfig[k]);
      switch (step) {
        case 1:
          if (isDBConfig) {
            return this.redirect('/index/install?step=2');
          }
          break;
        case 2:
          if (!isDBConfig) {
            return this.redirect('index/install');
          }
          if (await install.checkInstalled()) {
            message = 'success';
          }
          break;
      }

      this.assign({message});
      return this.display();
    }

    if (global.isInstalled) {
      return this.fail('SYSTEM_INSTALLED');
    }

    const errors = this.assign('errors');
    if (!think.isEmpty(errors)) {
      this.assign('message', errors[Object.keys(errors)[0]]);
      return this.display();
    }

    const data = this.post();
    switch (data.step) {
      case 2:
        const siteInfo = {
          title: data.title,
          site_url: data.site_url,
          username: data.username,
          password: data.password
        };
        try {
          await install.saveSiteInfo(siteInfo);
          message = 'success';
        } catch (e) {
          message = e;
        }
        break;

      default:
        const dbInfo = {
          host: data.db_host,
          port: data.db_port,
          database: data.db_name,
          user: data.db_account,
          password: data.db_password,
          prefix: data.db_table_prefix
        };
        try {
          await install.saveDbInfo(dbInfo);
          message = 'success';
        } catch (e) {
          message = e;
        }
        break;
    }
    this.assign({message, data});
    return this.display();
  }
};
