import Axios from './Axios';
import { AxiosInstance } from './types';

// 创建 axios 示例方法
function createInstance() {
  let context: Axios<any> = new Axios(); // this 指针上下文
  // 使 request 中的 this 指向 context (new Axios())
  let instance = Axios.prototype.request.bind(context);
  // 拷贝类实例和原型上的方法到 instance (request 方法) 上
  instance = Object.assign(instance, Axios.prototype, context);
  return instance as AxiosInstance;
}

let axios = createInstance();

export default axios;

export * from './types';