// default config
module.exports = {
  workers: 1,
  logFormat: '$remote_addr - $remote_user [$time_local] ' +
    '"$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"',
  logFile(date) {
    const datetime = think.datetime(date, 'YYYY-MM-DD-HH-mm');
    return `/var/log/nginx/pharos/${datetime}-access.log`;
  }
};
