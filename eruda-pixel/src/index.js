import Draggabilly from 'draggabilly';
import injectString from './core.txt';
import styleString from './style.txt';
import PostMessager from './post-messager';

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
function _bindDragEvent($el, Messager) {
  const draggabilly = new Draggabilly($el, {});

  draggabilly.on('dragEnd', () => {
    Messager.send('img-position', {
      top: $el.style.top,
      left: $el.style.left,
    });
  });
}

function _bindPostMessage($iframe) {
  const targetWindow = $iframe.contentWindow;
  const Messager = new PostMessager(targetWindow);
  let $img = null;
  Messager.listen('img-created', () => {
    const container = document.querySelector('#eruda-pixel-upload-img-container');
    const shadowImg = container.shadowRoot
      ? container.shadowRoot.querySelector('#eruda-pixel-upload-img')
      : null;
    // 真实节点
    const lightImg = container.querySelector('#eruda-pixel-upload-img');

    $img = shadowImg || lightImg; // 首选虚拟节点，没有则真实节点
    _bindDragEvent($img, Messager);
  });
  Messager.listen('img-opacity', (data) => {
    const opacity = data.opacity / 100;
    $img.style['opacity'] = opacity;
  });

  Messager.listen('img-freeze', (data) => {
    if (data.freeze) {
      $img.style['pointerEvents'] = 'none';
    } else {
      $img.style['pointerEvents'] = 'auto';
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
    $img.style['mixBlendMode'] = data.mode;
  });

  Messager.listen('img-info', (data) => {
    $img.style['width'] = data.info.width + 'px';
    $img.style['height'] = 'auto';
    $img.style['left'] = data.info.left + 'px';
    $img.style['top'] = data.info.top + 'px';
  });
}
module.exports = function (eruda) {
  class Pixel extends eruda.Tool {
    constructor() {
      super();
      this.name = 'pixel';
    }
    init($el, container) {
      super.init($el, container);
      $el.html(require('./template.hbs')());
      const $iframe = this._$el.find('#eruda-pixel-iframe').get(0);
      injectJs(injectString, $iframe);
      injectCss(styleString, $iframe);
      _bindPostMessage($iframe, this._$el);
    }

    show() {
      super.show();
    }

    hide() {
      super.hide();
    }
    destroy() {
      super.destroy();
    }
  }

  return new Pixel();
};
