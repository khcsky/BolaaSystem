import axios from './http' // 导入http中创建的axios实例
import qs from 'qs'
// getList:列表请求 add: 添加 update: 更新
// 登陆
const login = {
    login (params) {
        return axios.post(`user/login`, params);
    },
    updatePwd (params) {
        return axios.post(`user/password`, qs.stringify(params));
    }
}

// 项目管理
const project = {
    getList (params) {
        return axios.post(`project/findAll`, params);
    },
    insert (params) {
        return axios.post(`project/insert`, params);
    },
    update (params) {
        return axios.post(`project/update`, params);
    },
    getRemoteList (params) {
        const url  = params.nameOrNum === '' ? `projectIndustry/getProjectIndustryList` :
            `projectIndustry/selectNameOrNum`;
        return axios.post(url, params);
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

