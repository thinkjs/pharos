
const metrics = [
  'consume_time',
  'browser_time'
];

module.exports = metrics.map(metric => ({
  cron: '*/5 * * * *',
  handle: `api/metric/${metric}?_method=post`,
  type: 'one'
}));
