import qs from 'qs';
import parseHeaders from 'parse-headers';
import { AxiosRequestConfig, AxiosResponse } from './types';
import AxiosInterceptorManager, { Interceptor }  from './AxiosInterceptorManager';
let defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: { // 请求头
    common: { // 所有请求方法公共请求头配置方式
      // 指定告诉服务器返回 json 类型数据
      accept: 'application/json',
      name: 'request-nzc'
    }
  },
  // 转化请求、响应
  transformRequest: (data: any, headers: any) => {
    headers['common']['name'] = 'transformRequest-nzc';
    return data;
  },
  transformResponse: (response: any) => {
    return response.data;
  }
}

// get 类型请求方式
let getStyleMethods = ['get', 'head', 'delete', 'options'];
getStyleMethods.forEach((method: string) => {
  defaults.headers![method] = {};
});

// post 类型请求方式
let postStyleMethods = ['post', 'put', 'patch'];
postStyleMethods.forEach((method: string) => {
  defaults.headers![method] = {
    'content-type': 'application/json',
  };
});

let allMethods = [...getStyleMethods, ...postStyleMethods];
export default class Axios<T> {
  public defaults: AxiosRequestConfig = defaults;
  public interceptors = {
    request: new AxiosInterceptorManager<AxiosRequestConfig>(),
    response: new AxiosInterceptorManager<AxiosResponse<T>>(),
  }

  // T 限制 response 中 data 类型
  request(config: AxiosRequestConfig): Promise<AxiosRequestConfig | AxiosResponse<T>> {
    // return this.dispatchRequest<T>(config);
    config.headers = Object.assign(this.defaults.headers, config.headers);
    config = Object.assign(this.defaults, config);
    // 转化响应
    if (config.transformRequest && config.data) {
      config.data = config.transformRequest(config.data, config.headers);
    }
    // 拦截器和请求数组链
    const chain: Array<Interceptor<AxiosRequestConfig> | Interceptor<AxiosResponse<T>>> = [
      {
        onFulfilled: this.dispatchRequest,
        onRejected: (error: any) => error,
      }
    ];

    // 请求拦截器数组 [request1, request]; [request2, request1, request];
    this.interceptors.request.interceptors.forEach((interceptor: Interceptor<AxiosRequestConfig> | null) => {
      // 在数组链头部依次插入请求拦截器
      interceptor && chain.unshift(interceptor);
    });

    // 响应拦截器数组 [response, response1]; [response, response1, response2];
    this.interceptors.response.interceptors.forEach((interceptor: Interceptor<AxiosResponse<T>> | null) => {
      // 在数组链头部依次插入请求拦截器
      interceptor && chain.push(interceptor);
    });

    // let promise: Promise<AxiosRequestConfig> = Promise.resolve(config);
    let promise: Promise<any> = Promise.resolve(config); // TODO: Promise 对应成功状态范性类型需做处理

    while (chain.length > 0) {
      // ! 非空断言, 明确到了这一步 chain.shift() 一定不为 undefined ｜ null，去除 ts 编译为空警告
      const { onFulfilled, onRejected } = chain.shift()!; // shift 删除数组头部元素并返回该元素
      promise = promise.then(onFulfilled, onRejected);
    }

    return promise;
  }

  // 定义一个派发请求的方法
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>> ((resolve, reject) => {
      let { method = 'get', url, params, headers, data, timeout } = config;

      // 1. 实例化请求
      let request = new XMLHttpRequest();
      if(params) {
        params = qs.stringify(params);
        url += ((url!.indexOf('?') === -1 ? '?' : '&') + params);
      }
      // 2. 指定请求
      request.open(method, url!, true);
      // 想要返回的 data 类型为 json 对象
      request.responseType = 'json';
      // 3. 指定一个状态变更函数
      request.onreadystatechange = () => {
        // readyState 值为4, 并且 status 值不为0(请求为超时), 表示请求完成
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
            // 转化响应
            if (config.transformResponse) {
              response = config.transformResponse(response);
            }
            resolve(response);
          } else {
            reject(`Error: Request failed with status code ${request.status}`);
          }
        }
      }
      // 设定请求头信息
      // if (headers) {
      //   for(let key in headers) {
      //     request.setRequestHeader(key, headers[key]);
      //   }
      // }
      if (headers) {
        for (let key in headers) {
          if (key === 'common' || allMethods.includes(key)) {
            if (key === 'common' || key === config.method) {
              for (let key2 in headers[key]) {
                request.setRequestHeader(key2, headers[key][key2]);
              }
            }
          } else {
            request.setRequestHeader(key, headers[key]);
          }

          // if (key === 'common' || (allMethods.includes(key) && key === config.method)) {
          //   for (let key2 in headers[key]) {
          //     request.setRequestHeader(key2, headers[key][key2]);
          //   }
          // } else {
          //   request.setRequestHeader(key, headers[key]);
          // }
        }
      }

      // 响应体数据信息
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

      // 4. 发送请求
      request.send(body);
    });
  }
}