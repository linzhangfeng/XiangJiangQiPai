import request from '@/utils/request'
// userinformation-begin
export function getOrderCostSum(data) {
    return request({
        url: '/getOrderCostSumByDate',
        method: 'post',
        data
    })
}

export function getUserListSum(data) {
    return request({
        url: '/getUserSumByDate',
        method: 'post',
        data
    })
}