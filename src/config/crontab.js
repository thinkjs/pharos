module.exports = [{
  cron: '*/5 * * * *',
  handle: 'api/metric/consume_time?_method=post',
  type: 'one'
}];
