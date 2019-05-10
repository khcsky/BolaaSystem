/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '../router'

const tip = msg => {
 console.log(msg)
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  // router.replace({
  //   path: '/login',
  //   query: {
  //     redirect: router.currentRoute.fullPath
  //   }
  // })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 400:
      tip('请求错误')
      break
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录')
      localStorage.removeItem('token')
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    case 408:
      tip('请求的资源不存在')
      break
    case 500:
      tip('服务器内部错误')
      break
    case 501:
      tip('服务器未实现')
      break
    case 502:
      tip('网关错误')
      break
    case 503:
      tip('服务不可用')
      break
    case 504:
      tip('网关超时')
      break
    case 505:
      tip('HTTP版本不受支持')
      break
    default:
      console.log(other)
  }
}

// 创建axios实例
const instance = axios.create({
  // baseURL: process.env.API_ROOT,
  baseURL: location.origin + '/',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  withCredentials: true,
  crossDomain: true,
  timeout: 1000 * 12
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // 获取浏览器中的token
    const token = window.localStorage.getItem('token');
    // 设置请求头 携带token
    token && (config.headers.Authorization = token);
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    return res
    // res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      const msg = response.data ? response.data.message : '请求错误'
      errorHandle(response.status, msg)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      console.log('网络错误');
    }
  })

export default instance
