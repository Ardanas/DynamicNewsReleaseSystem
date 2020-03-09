import axios from 'axios'
//import defaultConfig from './config'
//const { backendUrl} = defaultConfig
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Authorization": 'Bearer YWxhZGRpbjpvcGVuc2VzYW1l',
    }
})

instance.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})


export default function request(method = 'get', url, data = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method,
            data,
            headers
        }
        //console.log(instance(options))
        instance(options)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
