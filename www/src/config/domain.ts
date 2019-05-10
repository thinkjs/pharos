import env from './env'

const _rootDomainMap = {
  development: 'local.pharos.cc',
  test: 'local.pharos.net',
  production: 'www.pharos.com',
}

export const baseURL = env === 'dev' ? 'http://127.0.0.1:8360/' : 'http://127.0.0.1:8360/'

export const rootDomain = _rootDomainMap[env] || _rootDomainMap.test