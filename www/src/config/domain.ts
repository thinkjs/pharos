import env from "./env";
const apiUrlMap = {
  development: "http://pharos2.baomitu.com/",
  test: "http://pharos2.baomitu.com/",
  production: "/"
};

export const baseURL = apiUrlMap[env];
// export const rootDomain = _rootDomainMap[env] || _rootDomainMap.test
