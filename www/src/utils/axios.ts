import { IResult } from '../models/http.model';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message, notification } from 'antd'
import { baseURL } from '../config/domain'
import history from './history'

axios.defaults.baseURL = baseURL

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  if (status === 401) {
    notification.error({
      message: "未登录或登录已过期，请重新登录。",
    });
    history.push("/login");
    return;
  }
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // environment should not be used
  if (status === 403) {
    history.push("/login");
    return;
  }
  // if (status >= 404) {
  //   history.push("/exception/404");
  // }
};


axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.withCredentials = true
  return config
}, (error: AxiosError) => {
  message.error(error)
  return error
})


axios.interceptors.response.use(
  (result: AxiosResponse<IResult<any, any>>) => {
    if (result.data.errno !== 0) {
      message.error(result.data.errmsg);
      return Promise.reject(result.data.errmsg)
    }
    return Promise.resolve(result);
  },
  (error: AxiosError) => {
    errorHandler(error)
    return Promise.reject(error)
  }
)

// http响应拦截器
// axios.interceptors.response.use(data => {
//   console.log(456, data)
//   // if (!data || typeof data.data !== 'object') {
//   //   message.error('服务器响应格式错误')
//   //   return false
//   // }
//   const result = data.data

//   if (result.errno && result.errno !== 0) {
//     message.error(result.errmsg)
//     // errAction[result.errno]()
//     return false // 错误码统一返回false，在这里统一处理，页面不对其处理
//   }
//   return result
// }, error => {
//   console.log('error', error)
//   message.error('服务器响应错误')
//   return Promise.reject(error)
// })
export default axios
