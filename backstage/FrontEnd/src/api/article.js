import request from '@/utils/request'
// userinformation-begin
export function getOrderList(data) {
    return request({
        url: '/getOrderDetailList',
        method: 'post',
        data
    })
}

//添加订单
export function addOrder(data) {
    return request({
        url: '/addOrderDetail',
        method: 'post',
        data
    })
}

//编辑订单
export function editOrder(data) {
    return request({
        url: '/updateOrderDetail',
        method: 'post',
        data
    })
}

//删除订单
export function deleteOrder(data) {
    return request({
        url: '/deleteOrderDetail',
        method: 'post',
        data
    })
}

//查询用户列表
export function getUserList(data) {
    return request({
        url: '/getUserList',
        method: 'post',
        data
    })
}

//修改用户信息
export function editUserInfo(data) {
    return request({
        url: '/updateUserInfo',
        method: 'post',
        data
    })
}

//新增用户
export function addUserInfo(data) {
    return request({
        url: '/addUser',
        method: 'post',
        data
    })
}

//查询子用户
export function getChildUserList(data) {
    return request({
        url: '/getChildUserList',
        method: 'post',
        data
    })
}

// userinformation-end

export function fetchList(query) {
    return request({
        url: '/vue-element-admin/article/list',
        method: 'get',
        params: query
    })
}

export function fetchArticle(id) {
    return request({
        url: '/vue-element-admin/article/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(pv) {
    return request({
        url: '/vue-element-admin/article/pv',
        method: 'get',
        params: { pv }
    })
}

export function createArticle(data) {
    return request({
        url: '/vue-element-admin/article/create',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/vue-element-admin/article/update',
        method: 'post',
        data
    })
}