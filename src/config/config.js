const nodemailer = require('nodemailer');

// default config
module.exports = {
  workers: 1,
  logFormat: '$remote_addr - $remote_user [$time_local] ' +
    '"$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"',
  logFile(date) {
    const datetime = think.datetime(date, 'YYYY-MM-DD-HH-mm');
    return `/data/nginx/logs/pharos/${datetime}-access.log`;
  },
  alarm(users, text) {
    const emails = users.map(user => user.email);
    const transporter = nodemailer.createTransport();
    return transporter.sendMail({
      from: 'no-reply@pharos.baomitu.com',
      to: emails,
      subject: text
    });
  }
};
