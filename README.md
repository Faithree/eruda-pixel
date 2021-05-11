### 是什么
基于移动端调试工具 eruda 开发的一款 UI 高精度还原辅助工具，设计师验收页面利器。

原理是把设计图插入到页面中，降低设计图透明度。然后进行对比。
#### 设计师给的设计图
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14cd89f8bf36413f881fad211b501ec2~tplv-k3u1fbpfcp-watermark.image)

#### 开发出来之后实际实现效果
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/347907020803403290caeaf75f0775aa~tplv-k3u1fbpfcp-watermark.image)
#### 使用 eruda-pixel 工具后，开发自查，设计验收效果

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4c3f82c61044b3a86e19cab09dcb617~tplv-k3u1fbpfcp-watermark.image)

### 安装
#### npm 安装

```bash

npm install eruda eruda-pixel -D
```

```javascript
eruda.init();
eruda.add(erudaPixel);
```
#### cdn安装

```typescript
const loadOneJS = (url, callback) => {
  const script = document.createElement('script');
  const fn = callback || (() => {});

  script.type = 'text/javascript';

  script.onload = () => {
    fn();
  };

  script.src = url;

  document.getElementsByTagName('head')[0].appendChild(script);
};
const loadJS = (urls, callback) => {
  let i = 0;
  const fn = callback || (() => {});

  urls.forEach((url) => {
    loadOneJS(url, () => {
      i = 1 + i;
      if (urls.length === i) {
        fn();
      }
    });
  });
};

loadJS(
  [
    '//cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.min.js',
    '//unpkg.com/eruda-pixel@1.0.9/eruda-pixel.js',
  ],
  () => {
    const eruda = window.eruda;
    if (typeof eruda !== 'undefined') {
      eruda.init();
      eruda.add(window.erudaPixel);
    }
  },
);
```

### 功能
点开 pixel 面板，上传 ui 设计图（图片存放到页面内存里，不会上传到任何地方）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9dd047a8648468091d0ee27566cada9~tplv-k3u1fbpfcp-watermark.image)

1. 冻结：设计图不可拖动，防止影响页面的一些鼠标事件
2. 坐标轴：基于左上角
3. 模式： 支持多种模式，找出页面不同点
3. 刷新页面保留设计图
4. 只支持单张设计图上传，重新上传会覆盖前一张设计图

### 优势
1. 方便快速，支持 npm 和 cdn 安装，甚至能像我上面的 demo 通过抓包工具注入插件到某个网站上
2. 支持手机真机调试
3. 插件使用 shadow dom + iframe，没有 DOM、JavaScript、CSS 污染真实页面
4. 虽然是移动端调试工具，但是 pc 端也适用
