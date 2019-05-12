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
