const TEST_URL = 'test.com';
// let baseURL = 'http://test.com:8360/';
let baseURL = 'https://pharos.eming.li';
if (!location.host.includes(TEST_URL)) {
  baseURL = location.protocol + '//' + location.host + '/';
}

module.exports = {
  name: 'Pharos',
  footerText: '',
  logo: '/static/public/logo.png',
  baseURL,
  api: {
    auth: {
      login: '/api/token',
      register: '/api/user',
    },
    site: '/api/site',
    user: '/api/user',
    perf: {
      overview:'/api/metric/consume_time',
    }
  },
};
