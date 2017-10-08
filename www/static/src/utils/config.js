
module.exports = {
  name: 'Pharos',
  footerText: '',
  logo: '/static/public/logo.png',
  baseURL:'http://localhost:8360/',
  api: {
    auth:{
      login:'/api/token',
      register:'/api/user'
    }
  },
}
