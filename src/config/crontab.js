
const metrics = [
  'consume_time',
  'browser_time',
  'os_time',
  'region_time'
];

metrics.map(metric => think.messenger.on(metric, () => {
  const data = global.PHAROS_DATA[metric];
  delete global.PHAROS_DATA[metric];
  return data;
}));

module.exports = metrics.map(metric => ({
  cron: '*/5 * * * *',
  handle: `api/metric/${metric}?_method=post`,
  type: 'one'
}));
