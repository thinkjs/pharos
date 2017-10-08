import axios from 'axios'
import qs from 'qs'
import { baseURL } from './config'
import lodash from 'lodash'
import {message} from 'antd';

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options;

  const cloneData = lodash.cloneDeep(data) || {};

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      });
    case 'post':
      return axios.post(url, qs.stringify(cloneData));
    case 'put':
      return axios.put(url, cloneData);
    case 'patch':
      return axios.patch(url, cloneData);
    default:
      return axios(options)
  }
};

export default function request (options) {
  return fetch(options).then((response) => {
    if(response.headers['content-type'].indexOf('application/json') === -1){
      return response.data;
    }
    let data = response.data;
    // 未登录
    if(data.errno == 10002){
      //location.href = '/login';
      return false;
    }

    if(data.errno != 0) {
      message.error(data.errmsg);
      return false;
    }
    data = data.data;
    return data || [];
  }).catch((error) => {
    console.error(error);
    message.error('系统开小差了,一会儿再试吧~');
    return null;
  })
}
