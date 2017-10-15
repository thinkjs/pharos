import {request} from 'utils';
import {config} from 'utils';
const api = config.api.auth;

export default {
  login: (params = {})=> {
    return request({
      url: api.login,
      data: params,
      method: 'POST'
    })
  },
  logout: ()=> {
    return request({
      url: api.login,
      method: 'DELETE'
    })
  },
  register: (params = {})=> {
    return request({
      url: api.register,
      data: params,
      method: 'POST'
    })
  }
}
