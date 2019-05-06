// default config
module.exports = {
  workers: 1,
  logFile(date) {
    const datetime = think.datetime(date, 'YYYY-MM-DD-HH-mm');
    return `/var/log/nginx/pharos/${datetime}-access.log`;
  }
};
