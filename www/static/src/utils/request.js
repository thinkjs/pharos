import axios from 'axios'
import qs from 'qs'
import { baseURL } from './config'
import lodash from 'lodash'
import {message} from 'antd';
import pathToRegexp from 'path-to-regexp';

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options;

  const cloneData = lodash.cloneDeep(data) || {};
  const toPath = pathToRegexp.compile(url);
  url = toPath(cloneData);
  
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      });
    case 'delete':
      // url += `/${cloneData.id || ''}`;
      return axios.delete(url);
    case 'post':
      return axios.post(url, qs.stringify(cloneData));
    case 'put':
      // url += `/${cloneData.id || ''}`;
      return axios.put(url,cloneData);
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
    // if(data.errno == 1000){
      // location.href = '/login';
      // return false;
    // }

    if(data.errno != 0) {
      const errmsg = data.errmsg;
      if (typeof errmsg === 'string' || errmsg instanceof String){
        message.error(errmsg);
      } else if( (typeof errmsg === "object") && (errmsg !== null) ){
        message.error(errmsg[Object.keys(errmsg)[0]]);
      }
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
