import request from '@/utils/request'

export function getProductList(data) {
    return request({
        url: '/getProductList',
        method: 'post',
        data
    })
}

export function addProduct(data) {
    return request({
        url: '/addProduct',
        method: 'post',
        data
    })
}

export function editProduct(data) {
    return request({
        url: '/editProduct',
        method: 'post',
        data
    })
}

export function removeProduct(data) {
    return request({
        url: '/removeProduct',
        method: 'post',
        data
    })
}