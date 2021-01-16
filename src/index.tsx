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
const CancelToken = axios.CancelToken;
const isCancel = axios.isCancel;
const source = CancelToken.source();
console.time('cost');

// post 方法
axios({
  method: 'post',
  url: `${baseURL}/post`,
  headers: {},
  cancelToken: source.token,
  timeout: 1000,
  data: user,
}).then((response: AxiosResponse) => {
  console.log(response);
  return response.data;
}).catch((error: any) => {
  if (isCancel(error)) {
    console.log('isCancel 取消请求！！！');
  }
  console.log(error);
})

source.cancel('我取消了请求！！！');
