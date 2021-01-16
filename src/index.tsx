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
console.time('cost');

// post 方法
axios({
  method: 'post',
  url: `${baseURL}/post`,
  headers: {

  },
  timeout: 1000,
  data: user,
}).then((response: AxiosResponse) => {
  console.log(response);
  return response.data;
}).catch((error: any) => {
  console.log(error);
})

