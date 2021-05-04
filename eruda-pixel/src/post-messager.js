export function isString(str) {
  return toString.call(str) === '[object String]';
}
export function isFunction(fn) {
  return toString.call(fn) === '[object Function]';
}
const readyType = '__POST_MESSAGER_READY__';
/**
 * 基于window.postMessage实现的跨域页面通信机制
 */
export default class PostMessager {
  constructor(win, force = false) {
    // 消息侦听器列表，按消息类型建立key-value索引
    this.messageHandlers = {};
    // 等待发送的消息集合
    // 当通信机制未建立完毕之前，发送的消息会堆积起来
    // 当通信机制建立完毕之后，一次性全部发送出去
    this.waitingSenders = [];
    this.messageAllHandles = null;
    this.onReceiveMessage = (evt) => {
      // 非目标窗口的消息，过滤
      if (evt.source !== this.targetWindow) {
        return;
      }
      // 非规范消息，过滤
      if (!evt.data || !isString(evt.data)) {
        return;
      }
      try {
        // 解析消息体
        const res = JSON.parse(evt.data);
        console.log(res);
        // 接收到目标窗口发送来的准备就绪系统消息，表示通信机制已成功建立
        if (res.type === readyType) {
          this.isReady = true;
          // 一次性发送全部等待中的消息
          for (const sender of this.waitingSenders) {
            this.send(sender.type, sender.data);
          }
        }
        // 若订阅了全局message,则会把得到的res全部推送出去
        if (this.messageAllHandles && isFunction(this.messageAllHandles)) {
          this.messageAllHandles(res.data || res);
        }
        // 业务消息处理
        const handlers = this.messageHandlers[res.type];
        if (!handlers || !handlers.length) {
          return;
        }
        for (const handler of handlers) {
          if (isFunction(handler)) {
            handler(res.data || res);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    this.isReady = false;
    // 目标跨域窗口句柄
    this.targetWindow = win;
    // 是否为强制模式
    this.force = force;
    if (!this.targetWindow) return;
    window.addEventListener('message', this.onReceiveMessage, false);
    // 发送一条准备就绪的系统消息，通知目标窗口
    this.targetWindow.postMessage(JSON.stringify({ type: readyType }), '*');
  }
  /**
   * 发送消息
   * @param  {string} type 消息类型
   * @param  {*} data      消息体（任意数据类型）
   * @return {boolean}
   */
  send(type, data) {
    if (!type || !isString(type) || !this.targetWindow) {
      return false;
    }
    // 通信机制未准备好，压入等待队列
    if (!this.isReady && !this.force) {
      this.waitingSenders.push({ type, data });
      return false;
    }
    // 向目标窗口发送消息
    this.targetWindow.postMessage(JSON.stringify({ type, data }), '*');
    return true;
  }
  listenAll(handler) {
    if (handler) {
      this.messageAllHandles = handler;
      return true;
    }
    return false;
  }
  /**
   * 侦听来自跨域页面的消息
   * @param {string} type 消息类型
   * @param {(data: any) => void} handler 侦听回调函数
   * @returns {boolean}
   */
  listen(type, handler) {
    if (!type || !handler || !isString(type) || !isFunction(handler)) {
      return false;
    }
    // 添加新的侦听器
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = [];
    }
    const handlers = this.messageHandlers[type];
    // 不允许重复添加同一个侦听器
    if (handlers.indexOf(handler) === -1) {
      handlers.push(handler);
    }
    return true;
  }
  /**
   * 取消消息侦听
   * @param {string} type 消息类型
   * @param {(data: any) => void} [handler] 侦听回调函数，当不传递此参数，则取消所有相同消息类型的侦听
   * @returns {boolean}
   */
  unlisten(type, handler) {
    if (!this.hasListen(type)) {
      return false;
    }
    if (!handler) {
      this.messageHandlers[type] = [];
      return true;
    }
    const handlers = this.messageHandlers[type];
    const idx = handlers.indexOf(handler);
    idx >= 0 && handlers.splice(idx, 1);
    return true;
  }
  /**
   * 取消所有消息侦听
   */
  unlistenAll() {
    this.messageAllHandles = null;
  }
  /**
   * 检测是否已侦听了该类型的消息
   * @param  {string}  type 消息类型
   * @return {boolean}
   */
  hasListen(type) {
    if (!type || !isString(type)) {
      return false;
    }
    const handlers = this.messageHandlers[type];
    return handlers && handlers.length > 1;
  }
  /**
   * 关闭跨域通信机制
   * 1.注销message事件
   * 2.取消所有侦听
   * 3.删除目标窗口句柄
   * 4.还原isReady
   */
  close() {
    window.removeEventListener('message', this.onReceiveMessage);
    this.unlistenAll();
    this.targetWindow = null;
    this.isReady = false;
    this.force = false;
  }
}
