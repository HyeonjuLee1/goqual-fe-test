import axios from 'axios'

const axiosInst = axios.create({
  baseURL: 'http://hejdev1.goqual.com:8080',
})

axiosInst.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInst
