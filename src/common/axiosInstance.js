import axios from 'axios'
//import defaultConfig from './config'
//const { backendUrl} = defaultConfig
const token = localStorage.getItem('access_token')
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Authorization": `Bearer ${token}`,
    }
})

export default instance