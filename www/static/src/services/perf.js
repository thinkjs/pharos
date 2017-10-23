import {request,config} from 'utils';
const api = config.api.perf;

export default {
  query: (params = {})=> {
    return request({
      url: api.overview,
      data: params,
    })
  },
}
