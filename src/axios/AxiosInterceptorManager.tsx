export interface OnFulfilled<T> {
  (value: T): T | Promise<T>;
}

export interface OnRejected {
  (error: any): any;
}

// 拦截器类型
export interface Interceptor<T> {
  onFulfilled?: OnFulfilled<T>; // 成功回调函数
  onRejected?: OnRejected // 失败回调函数
}

// 拦截器管理类型，T 范性类型可能为 AxiosRequestConfig 或 AxiosResponse
export default class AxiosInterceptorManager<T> {
  public interceptors: Array<Interceptor<T> | null> = [];
  // 可以向拦截管理器中添加对应的方法
  use(onFulfilled?: OnFulfilled<T>, onRejected?: OnRejected): number {
    this.interceptors.push({
      onFulfilled,
      onRejected,
    });
    return this.interceptors.length -1;
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}