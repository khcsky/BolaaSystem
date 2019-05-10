import Mock from 'mockjs'

const Random = Mock.Random
const baseUrl = location.origin + '/'

Mock.setup({
    timeout: '200 - 400'
})

// 每页数据数量
const pageNum = 3

const mockAccounts = function () {
    const code = 1
    const msg = '客户获取成功'
    const total = Random.integer(1, 10)
    const account = []
    for (let i = 0; i < pageNum; i++) {
        account.push( {
            id: (Math.random() * Date.now() / 1000000).toFixed(0),
            name: Random.cname(3, 6),
            company_name:  Random.cname(6, 12)
        })
    }

    return {code, msg, total, account}
}

const mockPlate = function () {
    const code = 0
    let listQuery = sessionStorage.getItem('listQuery')
   //  const total = Random.integer(1, 10)
    const page = {
        "page": 1,
        "rows": 9,
        "totalRows": 12,
        "orderBy": null,
        "order": null,
        "sort": null,
        "end": 9,
        "start": 0,
        "pageTotal": 100
    };
    const data = []
    listQuery = listQuery ? JSON.parse(listQuery) : {
        page: 1, //当前默认页
        limit: 3 //每页多少条数据
    };
    for (let i = 0; i < listQuery.limit; i++) {
        data.push( {
            pid: (Math.random() * Date.now() / 1000000).toFixed(0),
            pname: Random.cname(3, 6),
            company_name:  Random.cname(6, 12),
            startTime: 15 * Math.pow(10, 11) + Random.integer(0, Math.pow(10, 11)),
            // endTime:  Random.date('yyyy/MM/dd'),
            endTime: 15 * Math.pow(10, 11) + Random.integer(0, Math.pow(10, 11)),
            industryId: (Math.random() * Date.now() / 1000000).toFixed(0),
            customerId: (Math.random() * Date.now() / 1000000).toFixed(0),
            stopTime:  15 * Math.pow(10, 11) + Random.integer(0, Math.pow(10, 11)),
            status: ['状态1', '状态2', '状态3'][Random.integer(0,2)],
            userId: (Math.random() * Date.now() / 1000000).toFixed(0),
            operateTime: 15 * Math.pow(10, 11) + Random.integer(0, Math.pow(10, 11)),
            remark: '备注'
        })
    }
    return {code, page, data}
}

const mockDelPlate = () => {
    return {code: 0, msg: '删除成功'};
}

const mockSavePlate = () => {
    return {code: 0, msg: '保存成功'};
}

const mockRemotePlate = () => {
    let data = [];
    for (let i = 0; i < Random.integer(5, 20); i++) {
        data.push({
            value: '选项' + i,
            label:Random.cname()
        })
    }

    return {code: 0, msg: '分类获取成功', data};
}


Mock.mock(`${baseUrl}account/getList`, 'post', mockPlate)
Mock.mock(`${baseUrl}account/delCollectList`, 'get', mockDelPlate)
Mock.mock(`${baseUrl}account/saveCollectList`, 'get', mockSavePlate)
Mock.mock(`${baseUrl}account/getRemoteList`, 'get', mockRemotePlate)
