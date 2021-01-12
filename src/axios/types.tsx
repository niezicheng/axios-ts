export type Methods = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS';

export interface AxiosRequestConfig {
  url?: string;
  method?: Methods;
  params?: any;
  headers?: Record<string, any>;
  data?: Record<string, any>;
}

// Axios.prototype.request 方法
export interface AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<T>;
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