import qs from 'qs';
import parseHeaders from 'parse-headers';
import { AxiosRequestConfig, AxiosResponse } from './types';

export default class Axios {
  // T 限制 response 中 data 类型
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.dispatchRequest<T>(config);
  }

  // 定义一个派发请求的方法
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>> ((resolve, reject) => {
      let { method = 'get', url, params, headers, data, timeout } = config;

      // 实例化请求
      let request = new XMLHttpRequest();
      if(params) {
        params = qs.stringify(params);
        url += ((url!.indexOf('?') === -1 ? '?' : '&') + params);
      }
      request.open(method, url!, true);
      // 想要返回的 data 类型为 json 对象
      request.responseType = 'json';
      // 指定一个状态变更函数
      request.onreadystatechange = () => {
        // readyState 值为4，表示请求完成
        if(request.readyState === 4 && request.status !== 0) {
          if(request.status >= 200 && request.status <= 300) {
            let response: AxiosResponse<T> = {
              data: request?.response || request?.responseText,
              status: request.status,
              statusText: request.statusText,
              // 'content-type=xx; content-length=42' => { content-type: xx, content-length: 42 }
              headers: parseHeaders(request.getAllResponseHeaders()),
              config,
              request,
            };
            resolve(response);
          } else {
            reject(`Error: Request failed with status code ${request.status}`);
          }
        }
      }
      if (headers) {
        for(let key in headers) {
          request.setRequestHeader(key, headers[key]);
        }
      }
      let body: string | null = null;
      if (data) {
        body = JSON.stringify(data);
      }
      // 网络错误
      request.onerror = () => {
        reject('net::ERR_INTERNET_DISCONNECTED');
      }
      // 超时错误
      if (timeout) {
        request.timeout = timeout;
        request.ontimeout = () => {
          reject(`Error: timeout of ${timeout}ms exceeded`);
        }
      }
      //发送请求
      request.send(body);
    });
  }
}