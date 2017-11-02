const PERFS = [
  {
    name: 'loadPage',
    description: '页面加载完成的时间'
  },
  {
    name: 'domReady',
    description: '解析 DOM 树结构的时间'
  },
  {
    name: 'redirect',
    description: '重定向的时间'
  },
  {
    name: 'lookupDomain',
    description: 'DNS 查询时间'
  },
  {
    name: 'ttfb',
    description: '读取页面第一个字节的时间'
  },
  {
    name: 'request',
    description: '内容加载完成的时间'
  },
  {
    name: 'loadEvent',
    description: '执行 onload 回调函数的时间'
  },
  {
    name: 'appcache',
    description: 'DNS 缓存时间'
  },
  {
    name: 'unloadEvent',
    description: '浏览器卸载前一个页面（同一个域下）的时间'
  },
  {
    name: 'connect',
    description: 'TCP 建立连接完成握手的时间'
  }
];

module.exports = class extends think.Model {
  get schema() {
    return {
      id: {
        type: 'INT(11)',
        primary: true,
        unique: true,
        autoIncrement: true
      },
      url: {
        type: 'VARCHAR(255)'
      },
      name: {
        type: 'VARCHAR(255)'
      }
    };
  }

  get relation() {
    return {
      user: {
        type: think.Model.MANY_TO_MANY,
        field: ['name', 'display_name', 'email', 'id']
      },
      perf: {
        type: think.Model.HAS_MANY,
        field: ['id', 'name', 'description']
      }
    };
  }

  async afterAdd({id, user}, options) {
    if (!think.isArray(user)) {
      user = [user];
    }
    user = user.map(user => {
      if (typeof user !== 'object') {
        return {site_id: id, user_id: user};
      }
      user.site_id = id;
      return user;
    });
    await this.model('site_user').addMany(user);

    const perfs = PERFS.map(perf => {
      perf.site_id = id;
      return perf;
    });
    await this.model('perf').addMany(perfs);
  }

  addSite(data) {
    data.create_time = think.datetime();
    return this.add(data);
  }
};
