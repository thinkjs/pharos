import {request,config} from 'utils';
const api = config.api.user;

export default {
  query: (params = {})=> {
    return request({
      url: api,
      data: params,
    })
  },
  add: (params = {})=> {
    return request({
      url: api,
      data: params,
      method: 'POST'
    })
  },
  delete: (params = {})=> {
    return request({
      url: api,
      data: params,
      method: 'DELETE'
    })
  },
  edit: (params = {})=> {
    return request({
      url: api,
      data: params,
      method: 'PUT'
    })
  }
}
