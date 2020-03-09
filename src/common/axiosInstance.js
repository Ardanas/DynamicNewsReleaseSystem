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

export default instance