import env from './env'

const _rootDomainMap = {
  development: 'local.pharos.cc',
  test: 'local.pharos.net',
  production: 'www.pharos.com',
}

export const rootDomain = _rootDomainMap[env] || _rootDomainMap.test