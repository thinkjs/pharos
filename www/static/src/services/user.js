import {request,config} from 'utils';
const api = config.api.user;

export default {
  query: (params = {})=> {
    return request({
      url: api.query,
      data: params,
    })
  },
  add: (params = {})=> {
    return request({
      url: api.add,
      data: params,
      method: 'POST'
    })
  },
  delete: (params = {})=> {
    return request({
      url: api.delete,
      data: params,
      method: 'DELETE'
    })
  },
  edit: (params = {})=> {
    return request({
      url: api.edit,
      data: params,
      method: 'PUT'
    })
  }
}
