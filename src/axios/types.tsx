import AxiosInterceptorManager from './AxiosInterceptorManager';

export type Methods = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS';

export interface AxiosRequestConfig {
  url?: string;
  method?: Methods;
  params?: any;
  headers?: Record<string, any>;
  data?: Record<string, any>;
  timeout?: number;
}

// Axios.prototype.request 方法
export interface AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  }
}

// T: 响应体的类型
export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers?: Record<string, any>;
  config?: AxiosRequestConfig;
  request?: XMLHttpRequest;
}