import {request,config} from 'utils';
const api = config.api.perf;

export default {
  query: (params = {})=> {
    return request({
      url: api.overview,
      data: params,
    })
  },
  queryByOs:(params = {})=> {
    return request({
      url: api.queryByOs,
      data: params,
    })
  },
  queryByBrowser:(params = {})=> {
    return request({
      url: api.queryByBrowser,
      data: params,
    })
  },
}
