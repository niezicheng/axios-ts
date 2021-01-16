import axios, { AxiosResponse, AxiosRequestConfig } from './axios';
const baseURL = 'http://localhost:8080';

// 服务器返回的对象
interface User {
  name: string,
  password: string,
}

let user: User = {
  name: 'nzc',
  password: '123456'
}
console.time('cost');
// 请求拦截器先加的后执行, 返回值为对应标识索引
axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  config.headers && (config.headers.name += '1'); // nzc321
  console.timeEnd('cost');
  return config;
}, (error: any): any => Promise.reject(error));
let request = axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  config.headers && (config.headers.name += '2');
  return config;
})
axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      config.headers && (config.headers.name += '3');
      resolve(config);
    }, 3000);
  })
  // return config;
  // return Promise.reject('请求失败！'); // 请求失败直接终止请求
})
// 去除第二条拦截器
axios.interceptors.request.eject(request);

// 响应拦截器先加先执行
let response = axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
  response.data.name += '1';
  return response;
})
axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
  response.data.name += '2';
  return response;
})
axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
  response.data.name += '3'; // nzc123
  return response;
})
// 去除第一条响应拦截器
axios.interceptors.response.eject(response);

// get 方法
// axios({
//   method: 'get',
//   url: `${baseURL}/get`,
//   params: user,
// }).then((response: AxiosResponse) => {
//   console.log(response);
//   return response.data;
// }).catch((error: any) => {
//   console.log(error);
// })

// post 方法
axios({
  method: 'post',
  url: `${baseURL}/post`,
  headers: {
    'content-type': 'application/json',
    'name': 'nzc'
  },
  timeout: 1000,
  data: user,
}).then((response: AxiosResponse) => {
  console.log(response);
  console.log(response.data);
  return response.data;
}).catch((error: any) => {
  console.log(error);
})

