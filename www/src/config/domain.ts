import env from './env'
const apiUrlMap = {
  'development': 'http://api.pharos.net/',
  'test': '/',
  'production': 'http://api.pharos.com/',
}

console.log(555, process.env.NODE_ENV)

export const baseURL = apiUrlMap[env]
// export const rootDomain = _rootDomainMap[env] || _rootDomainMap.test