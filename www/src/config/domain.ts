import env from './env'
const apiUrlMap = {
  'development': 'http://127.0.0.1:8360/',
  'test': '/',
  'production': 'http://api.pharos.com/',
}

export const baseURL = apiUrlMap[env]
// export const rootDomain = _rootDomainMap[env] || _rootDomainMap.test