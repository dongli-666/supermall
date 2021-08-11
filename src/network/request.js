import axios from 'axios'

export function request(config) {
  // return new Promise((resolve, reject) => {
    
  // })
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })

  //axios的拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err =>{
    console.log(err);
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

    //发送真正的网络请求
  return instance(config);
}
