import axios, { AxiosResponse } from './axios';
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
  },
  data: user,
}).then((response: AxiosResponse) => {
  console.log(response);
  return response.data;
}).catch((error: any) => {
  console.log(error);
})
