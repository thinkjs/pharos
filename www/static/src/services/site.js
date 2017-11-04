import {request,config} from 'utils';
const api = config.api.site;
const fieldApi = config.api.site.field;
const userApi = config.api.site.user;

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
  },
  queryField: (params = {})=> {
    return request({
      url: fieldApi.query,
      data: params,
    })
  },
  addField: (params = {})=> {
    return request({
      url: fieldApi.add,
      data: params,
      method:'POST'
    })
  },
  editField: (params = {})=> {
    return request({
      url: fieldApi.edit,
      data: params,
      method:'PUT'
    })
  },
  deleteField: (params = {})=> {
    return request({
      url: fieldApi.delete,
      data: params,
      method:'DELETE'
    })
  },
  queryUser: (params = {})=> {
    return request({
      url: userApi.query,
      data: params,
    })
  },
  addUser: (params = {})=> {
    return request({
      url: userApi.add,
      data: params,
      method:'POST'
    })
  },
  editUser: (params = {})=> {
    return request({
      url: userApi.edit,
      data: params,
      method:'PUT'
    })
  },
  deleteUser: (params = {})=> {
    return request({
      url: userApi.delete,
      data: params,
      method:'DELETE'
    })
  },
}
