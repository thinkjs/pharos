import env from './env'
const apiUrlMap = {
  'development': 'http://api.pharos.net/',
  'test': 'http://api.pharos.net/',
  'production': '/',
}

export const baseURL = apiUrlMap[env]
// export const rootDomain = _rootDomainMap[env] || _rootDomainMap.test