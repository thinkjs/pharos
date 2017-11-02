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
  dashboardURL:'/perf/overview',
  api: {
    auth: {
      login: '/api/token',
      register: '/api/user',
    },
    site: {
      query:'/api/site',
      add:'/api/site',
      delete:'/api/site/:id',
      edit:'/api/site/:id',
      field:{
        query:'/api/site/:siteId/perf',
        add:'/api/site/:siteId/perf',
        edit:'/api/site/:siteId/perf/:id',
        delete:'/api/site/:siteId/perf/:id',
      },
    },
    user: {
      query:'/api/user',
      add:'/api/user',
      delete:'/api/user/:id',
      edit:'/api/user/:id'
    },
    perf: {
      overview:'/api/metric/consume_time',
      queryByOs:'/api/metric/os_time',
      queryByBrowser:'/api/metric/browser_time'
    }
  },
  ls_key:{
    site:'CURR_SITE'
  }
};
