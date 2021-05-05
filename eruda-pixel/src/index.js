import Draggabilly from 'draggabilly';
import injectString from './core.txt';
import styleString from './style.txt';
import PostMessager from './post-messager';

const injectJsOnce = onceJs(injectJs);
const injectCssOnce = onceCss(injectCss);
function injectJs(scriptContent, $iframe) {
  const div = $iframe.contentWindow.document.createElement('div');
  div.setAttribute('id', 'root');
  $iframe.contentWindow.document.body.appendChild(div);
  const script = $iframe.contentWindow.document.createElement('script');
  script.text = scriptContent;
  $iframe.contentWindow.document.body.appendChild(script);
}
function injectCss(cssContent, $iframe) {
  const style = $iframe.contentWindow.document.createElement('style');
  style.innerHTML = cssContent;
  $iframe.contentWindow.document.body.appendChild(style);
}
function onceJs(fn) {
  let loaded = false;
  return function () {
    if (!loaded) {
      fn.apply({}, arguments);
      loaded = true;
    }
  };
}
function onceCss(fn) {
  let loaded = false;
  return function () {
    if (!loaded) {
      fn.apply({}, arguments);
      loaded = true;
    }
  };
}
function _binndPostMessage($iframe, $el) {
  const targetWindow = $iframe.contentWindow;
  const Messager = new PostMessager(targetWindow, true);
  let $img = null;
  Messager.listen('img-created', () => {
    const shadowImg = document.body.shadowRoot
      ? document.body.shadowRoot.querySelector('#eruda-pixel-upload-img')
      : null;
    const lightImg = document.querySelector('#eruda-pixel-upload-img');
    $img = shadowImg || lightImg; // 虚拟节点或者真实节点
    const draggabilly = new Draggabilly($img, {});
    draggabilly.on('dragEnd', () => {
      Messager.send('img-position', {
        top: $img.style.top,
        left: $img.style.left,
      });
    });
  });
  Messager.listen('img-opacity', (data) => {
    const opacity = data.opacity / 100;
    $img.style['opacity'] = opacity;
  });

  Messager.listen('img-freeze', (data) => {
    if (data.freeze) {
      $img.style['pointer-events'] = 'none';
    } else {
      $img.style['pointer-events'] = 'auto';
    }
  });

  Messager.listen('img-show', (data) => {
    if (data.show) {
      $img.style['display'] = 'block';
    } else {
      $img.style['display'] = 'none';
    }
  });

  Messager.listen('img-mode', (data) => {
    $img.style['mix-blend-mode'] = data.mode;
  });

  Messager.listen('img-info', (data) => {
    $img.style['width'] = data.info.width + 'px';
    $img.style['height'] = 'auto';
    $img.style['left'] = data.info.left + 'px';
    $img.style['top'] = data.info.top + 'px';
  });
}
module.exports = function (eruda) {
  let { evalCss } = eruda.util;
  class Pixel extends eruda.Tool {
    constructor() {
      super();
      this.name = 'pixel';
      this._style = evalCss(require('./style.scss'));
    }
    init($el, container) {
      super.init($el, container);
      $el.html(require('./template.hbs')());
    }

    show() {
      const $iframe = this._$el.find('#eruda-pixel-iframe').get(0);
      injectJsOnce(injectString, $iframe);
      injectCssOnce(styleString, $iframe);
      _binndPostMessage($iframe, this._$el);
      super.show();
    }

    hide() {
      super.hide();
    }
    destroy() {
      super.destroy();
      evalCss.remove(this._style);
    }
  }

  return new Pixel();
};
