import request from '@/utils/request'

export function getCommissionList(data) {
    return request({
        url: '/getCommissionList',
        method: 'post',
        data
    })
}