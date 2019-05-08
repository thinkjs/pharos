module.exports = [
  {
    type: 'one',
    cron: '*/5 * * * *',
    handle: 'crontab/logstash'
  },
  {
    type: 'one',
    cron: '0 0 1 * *',
    handle: 'cron/clean'
  }
];
