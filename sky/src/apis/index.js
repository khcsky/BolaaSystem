import axios from './http' // 导入http中创建的axios实例
import qs from 'qs'

// const url ="172.16.60.64:80" + '/'
const url = ''
// 登录请求 
export function LoginCheck (params) {
    return axios.get(`${url}user/login`, params)
}
// // 采集管理 列表请求
// export function getCollectList (params) {
//     return axios.post(`${url}account/getList`, qs.stringify(params))
// }

// // 采集管理 删除
// export function delCollectList (params) {
//     return axios.get(`${url}account/delCollectList`, params)
// }

// // 采集管理 编辑
// export function saveCollectList (params) {
//     return axios.get(`${url}account/saveCollectList`, params)
// }

// // 采集管理 远程搜索
// export function getRemoteList (params) {
//     return axios.get(`${url}account/getRemoteList`, params)
// }

// //密码修改
// // 采集管理 远程搜索
// export function getSavePassword (params) {
//     return axios.post(`${url}account/getRemoteList`, qs.stringify(params))
// }
