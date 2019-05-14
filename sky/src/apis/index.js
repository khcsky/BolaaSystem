import axios from './http' // 导入http中创建的axios实例
import qs from 'qs'
// getList:列表请求 add: 添加 update: 更新
// 登陆
const login = {
    login (params) {
        return axios.post(`user/login`, qs.stringify(params));
    },
    updatePwd (params) {
        return axios.post(`user/password`, qs.stringify(params));
    }
}

// 项目管理
const project = {
    getList (params) {
        return axios.post(`project/findAll`, qs.stringify(params));
    },
    insert (params) {
        return axios.get(`project/insert`, params);
    },
    update (params) {
        return axios.get(`project/update`, params);
    },
    getRemoteList (params) {
        return axios.post(`project/update`, qs.stringify(params));
    }
}

// 行业管理
const industry = {
    getList (params) {
        return axios.post(`project/findAll`, qs.stringify(params));
    },
    insert (params) {
        return axios.get(`project/insert`, params);
    },
    update (params) {
        return axios.get(`project/update`, params);
    },
    getRemoteList (params) {
        return axios.post(`project/update`, qs.stringify(params));
    }
}

// 客户管理
const client = {
    getList (params) {
        return axios.post(`project/findAll`, qs.stringify(params));
    },
    insert (params) {
        return axios.get(`project/insert`, params);
    },
    update (params) {
        return axios.get(`project/update`, params);
    },
    getRemoteList (params) {
        return axios.post(`project/update`, qs.stringify(params));
    }
}

// 插件管理
const plugin = {
    getList (params) {
        return axios.post(`project/findAll`, qs.stringify(params));
    },
    insert (params) {
        return axios.get(`project/insert`, params);
    },
    update (params) {
        return axios.get(`project/update`, params);
    },
    getRemoteList (params) {
        return axios.post(`project/update`, qs.stringify(params));
    }
}

// 板块采集管理
const collect = {
    getList (params) {
        return axios.post(`project/findAll`, qs.stringify(params));
    },
    insert (params) {
        return axios.get(`project/insert`, params);
    },
    update (params) {
        return axios.get(`project/update`, params);
    },
    getRemoteList (params) {
        return axios.post(`project/update`, qs.stringify(params));
    }
}

// 板块分类管理
const plate = {
    getList (params) {
        return axios.post(`project/findAll`, qs.stringify(params));
    },
    insert (params) {
        return axios.get(`project/insert`, params);
    },
    update (params) {
        return axios.get(`project/update`, params);
    },
    getRemoteList (params) {
        return axios.post(`project/update`, qs.stringify(params));
    }
}


export default {
    login,
    project,
    industry,
    client,
    plugin,
    collect,
    plate
}

// 采集管理 列表请求
export function getCollectList (params) {
    // return axios.post(`account/getList`, qs.stringify(params))
}

// 采集管理 删除
export function delCollectList (params) {
    // return axios.get(`account/delCollectList`, qs.stringify(params))
}

// 采集管理 编辑
export function saveCollectList (params) {
    // return axios.get(`account/saveCollectList`, qs.stringify(params))
}

// 采集管理 远程搜索
export function getRemoteList (params) {
    // return axios.get(`account/getRemoteList`, qs.stringify(params))
}

