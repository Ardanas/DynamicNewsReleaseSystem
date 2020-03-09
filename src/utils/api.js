import request from './request'
import defaultConfig from '../common/config'
const api = {
    getMaterialList() {
        return request('get', `/user/getMaterialList?uid=${defaultConfig.uid}`);
    },
    addMaterialList(params) {
        return request('post', `/user/addMaterialList`, params, { 'Content-Type': 'multipart/form-data' });
    },
    addNews(params) {
        return request('post', `/user/addNews`, params);
    },
    getNews(params = 'all') {
        const url = params !== 'all' ? `&type=${params}` : ''
        return request('get', `/user/getNews?uid=${defaultConfig.uid}${url}`);
    },
    deleteNews(params) {
        return request('get', `/user/deleteNews?uid=${defaultConfig.uid}&id=${params}`);
    },
    getProfile() {
        return request('get', `/user/getProfile?uid=${defaultConfig.uid}`);
    },
    updateProfile(params) {
        return request('post', `/user/updateProfile`, params);
    }
}

export default api