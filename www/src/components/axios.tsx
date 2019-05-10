import axios from 'axios'
import { message } from 'antd'
import history from './history'
import { baseURL } from '../config/domain'
const dev = process.env.NODE_ENV !== 'production'
axios.defaults.baseURL = baseURL
axios.defaults.timeout = 5000
localStorage.getItem('token')
// http请求拦截器
axios.interceptors.request.use(config => {

  if (localStorage.getItem('token')) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  // config.headers['x-forwarded-for'] = 'admin'
  // 防止缓存
  // if (config.method === 'post'&& config.headers['Content-Type']!=='multipart/form-data') {
  //   config.data = {
  //     ...config.data,
  //     _t: Date.parse(new Date()) / 1000
  //   }
  // } else if (config.method === 'get') {
  //   config.params = {
  //     _t: Date.parse(new Date()) / 1000,
  //     ...config.params
  //   }
  // }
  return config
}, error => {
  message.error('请求服务器超时')
  return error
})


const errAction = {
  '401': () => { history.push('/login') },
  '1000': () => { history.push('/login') },
  '999': () => { }
}

// http响应拦截器
axios.interceptors.response.use(data => {
  if (!data || typeof data.data !== 'object') {
    message.error('服务器响应格式错误')
    return false
  }
  const result = data.data

  if (result.errno !== 0) {
    message.error(result.errmsg)
    errAction[result.errno]()
    return false // 错误码统一返回false，在这里统一处理，页面不对其处理
  }
  return result
}, error => {
  console.log('error', error)
  message.error('服务器响应错误')
  return Promise.reject(error)
})
export default axios
