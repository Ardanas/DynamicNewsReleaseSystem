import request from './request'
const api = {
    login(params) {
        return request('post', `login`, params);
    },
    sendMailCode(params) {
        return request('post', `sendMailCode`, params);
    },
    register(params) {
        return request('post', `register`, params)
    },
    getHomeList(params) {
        return request('get', `/user/getHomeList/${params}`)
    },
    getMaterialList() {
        return request('get', `/user/getMaterialList`);
    },
    addMaterialList(params) {
        return request('post', `/user/addMaterialList`, params);
    },
    deleteMaterialList(params) {
        return request('delete', `/user/material`, params);
    },
    addNews(params) {
        return request('post', `/user/news`, params);
    },
    getNews(params = 'all') {
        const url = params !== 'all' ? `&type=${params}` : ''
        return request('get', `/user/news?${url}`);
    },
    getNewsById(params) {
        return request('get', `/user/news/${params}`);
    },
    updateNews(params) {
        return request('post', `/user/news/${params.systemid}`, params);
    },
    deleteNews(params) {
        return request('delete', `/user/news/${params}`);
    },
    saveNews(params) {
        return request('patch', `/user/news/${params}`, params);
    },
    downNews(params) {
        return request('put', `/user/news/${params}`);
    },
    getProfile() {
        return request('get', `/user/getProfile`);
    },
    updateProfile(params) {
        return request('post', `/user/updateProfile`, params);
    },
    updatePassword(params) {
        return request('post', `/user/updatePassword`, params);
    },
    verifyFileMd5(params) {
        return request('post', `/user/verifyFile`, params);
    }
}

export default api