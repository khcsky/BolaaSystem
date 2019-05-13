import axios from './http' // 导入http中创建的axios实例
import qs from 'qs'

// 采集管理 列表请求
export function getCollectList (params) {
    return axios.post(`account/getList`, qs.stringify(params))
}
//
// // 采集管理 删除
// export function delCollectList (params) {
//     return axios.get(`account/delCollectList`, qs.stringify(params))
// }
//
// // 采集管理 编辑
// export function saveCollectList (params) {
//     return axios.get(`account/saveCollectList`, qs.stringify(params))
// }
//
// // 采集管理 远程搜索
// export function getRemoteList (params) {
//     return axios.get(`account/getRemoteList`, qs.stringify(params))
// }

export function login (params) {
    return axios.post(`user/login`, qs.stringify(params))
}

