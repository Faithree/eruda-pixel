# eruda-pixel

Eruda plugin for UI.


A high-precision UI restoration aid that is dedicated to making front-end developers headaches and crashes. Designers check tools.

## Demo

Browse it on your phone: 
[https://eruda.liriliri.io/](https://eruda.liriliri.io/)

## Install

```bash

npm install eruda eruda-pixel -D
```

```javascript
eruda.init();
eruda.add(erudaPixel);
```
## CDN

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
    '//unpkg.com/eruda-pixel@1.0.10/eruda-pixel.js',
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
Make sure Eruda is loaded before this plugin, otherwise won't work.