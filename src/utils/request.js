import axios from 'axios'
import { createHashHistory } from 'history'
const history = createHashHistory();
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    //withCredentials: true
})
//instance.defaults.retry = 4;
//instance.defaults.retryDelay = 3000;

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    //console.log('===token', token)
    //console.log(typeof token)
    if (token && token !== 'undefined') {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
}, error => {
    return Promise.reject(error)
})

// axios 响应拦截器
instance.interceptors.response.use(response => {
    //console.log(response)
    const { data, config } = response
    const { method, url, headers } = config
    // 判断token是否合理
    if (data.code === 10010) { // token过期, 取出refresh_token, 
        console.log('====refresh')
        console.log('====config', config)
        if (!isRefreshing) {
            isRefreshing = true
            console.log(localStorage.getItem('user_info'))
            const retoken = JSON.parse(localStorage.getItem('user_info')).refresh_token
           
            return request(method, url, config.data, { ...headers, retoken: `Bearer ${retoken}`}).then(res => {
                console.log('====refresh token', res)
                if (res.code == 10014) { //刷新token成功
                    localStorage.setItem('token', res.access_token)
                    requests.forEach(cb => cb(res.access_token))
                    // 重试完了别忘了清空这个队列
                    requests = []
                }
                return instance(config)
            }).catch(err => {
                console.error('refreshtoken error =>', err)
                const { response: { data }, config } = err;
                console.log('===response', response)
                console.log('===config', config)
                
                if (data.status === 401) {
                    if (data.code === 10013 || data.code === 10012 || data.code === 10011) { //token过期||找不到用户||无效token 重新登录
                        console.log('???go to login')
                        localStorage.removeItem('token')
                        localStorage.removeItem('user_info')
                        history.push('/login')
                    }
                }
            }).finally(() => {
                isRefreshing = false
            })
        } else {
            // 正在刷新token，返回一个未执行resolve的promise
            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests.push((token) => {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    resolve(request(config))
                })
            })
        }
    }
    return response;
}, error => {
    console.log('====error', error)
    const { response, config } = error
    if (!config || !config.retry) return Promise.reject(error);
    console.log('====response', response)
    if (response.status === 401) {
        if (response.code === 10013 || response.code === 10012 || response.code === 10011) { //token过期||找不到用户||无效token 重新登录
            localStorage.removeItem('token')
            history.push('/login')
        }
    }
    return Promise.reject(error);
});

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
