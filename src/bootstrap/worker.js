// invoked in worker
// invoked in worker
const cluster = require('cluster');
global.PHAROS_DATA = {};

global.section = [
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
const PERFS = [
  {
    name: 'loadPage',
    display_name: '页面加载时间',
    description: '页面加载完成的时间',
    type: 1
  },
  {
    name: 'domReady',
    display_name: 'DOM 解析时间',
    description: '解析 DOM 树结构的时间',
    type: 1
  },
  {
    name: 'redirect',
    display_name: '重定向时间',
    description: '重定向的时间',
    type: 1
  },
  {
    name: 'lookupDomain',
    display_name: 'DNS 查询时间',
    description: 'DNS 查询时间',
    type: 1
  },
  {
    name: 'ttfb',
    display_name: '服务端返回时间',
    description: '读取页面第一个字节的时间',
    type: 1
  },
  {
    name: 'request',
    display_name: '内容加载完成时间',
    description: '内容加载完成的时间',
    type: 1
  },
  {
    name: 'loadEvent',
    display_name: 'onload 时间',
    description: '执行 onload 回调函数的时间',
    type: 1
  },
  {
    name: 'connect',
    display_name: 'TCP建立时间',
    description: 'TCP 建立连接完成握手的时间',
    type: 1
  },
  {
  	name: 'jserror',
  	display_name: 'JS报错',
  	description: 'JS报错监控',
  	type: 2,
  	k1: 'errmsg',
  	k1_display_name: '错误信息'
  }
];


global.DefaultMetrics = [
    ...PERFS
];  

global.ROLES = {
  SUPER_ADMIN: 1,
  NORMAL_USER: 0,
  SITE_ADMIN: 1,
  WRITE_OFF: -1
};
[
  // 定义超管角色的 status 值
  ['SUPER_ADMIN', [1]],
  // 定义项目中管理员角色 status 值
  ['ADMIN', [1]]
].forEach(([roleName, statuses]) => {
  global[roleName] = statuses;
  global[roleName].is = status => statuses.indexOf(status) > -1;
});

think.messenger.on('restart', () => {
  cluster.worker.kill();
});
