import { preKey, parse, typeEvent } from './event';
const sourceXML = window.XMLHttpRequest;
const sourceFetch = window.fetch.bind(window);

const getSession = () => {
  const keys = ['apis', 'openMock'];
  const source = {};
  keys.forEach((key) => {
    source[key] = parse(window.sessionStorage.getItem(`${preKey}${key}`));
  });
  return source;
};
const findModifily = (url, _methods) => {
  if (!url || !_methods) {
    return;
  }
  const { apis } = getSession();
  if (!apis) {
    console.warn('apis找不到');
    return;
  }
  let match = false;
  let responseText = undefined;
  apis.forEach((item) => {
    if (item.disabled === true) {
      return;
    }
    if (match === true) {
      return;
    }
    const { schema } = item;
    const { paths } = schema;
    const matchTarget = paths.find((inner) => {
      const { methods, uri, disabled } = inner;
      if (disabled) {
        return false;
      }
      if (
        url.indexOf(uri) > -1 &&
        String(_methods).toLocaleLowerCase() === methods
      ) {
        return true;
      }
      return false;
    });
    if (!matchTarget) {
      return;
    }
    match = true;
    responseText = matchTarget.response;
  });
  return responseText;
};
class myXML {
  constructor() {
    this._method = '';
    const xhr = new sourceXML();
    xhr._open = xhr.open;
    const that = this;
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
            // 请求成功
            this.modifilyResponse();
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        };
        continue;
      }
      if (attr === 'open') {
        xhr.open = function (...args) {
          if (args.length === 0) {
          } else {
            that._method = args[0];
            xhr._open(...args);
          }
        };
      }
      if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          this.modifilyResponse();
          this.onload && this.onload.apply(this, args);
        };
        continue;
      }
      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr);
        continue;
      }
      if (['responseText', 'response'].includes(attr)) {
        Object.defineProperty(this, attr, {
          get: () => {
            const resValue =
              this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`];
            return resValue;
          },
          set: (val) => {
            return (this[`_${attr}`] = val);
          },
          enumerable: true,
        });
        continue;
      }
      Object.defineProperty(this, attr, {
        get: () => xhr[attr],
        set: (val) => (xhr[attr] = val),
        enumerable: true,
      });
    }
  }
  modifilyResponse() {
    const resText = findModifily(this.responseURL, this._method);
    if (resText) {
      this.responseText = resText;
      this.response = resText;
    }
  }
}
const myFetch = (...args) => {
  if (args.length === 0) {
    return Promise.reject();
  }
  let fetchUrl;
  let fetchMethods;
  if (args.length === 1) {
    fetchUrl = args[0];
  }
  if (args.length === 2) {
    fetchUrl = args[0];
    fetchMethods = typeof args[1] === 'object' && args[1].method;
  }
  const resText = findModifily(fetchUrl, fetchMethods);
  const encodeText =
    typeof resText === ' object' ? JSON.stringify(resText) : resText;
  return sourceFetch(...args).then((response) => {
    if (!resText) {
      return response;
    }
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(JSON.stringify(encodeText))
        );
        controller.close();
      },
    });

    const newResponse = new Response(stream, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
    const proxy = new Proxy(newResponse, {
      get: function (target, name) {
        switch (name) {
          case 'ok':
          case 'redirected':
          case 'type':
          case 'url':
          case 'useFinalURL':
          case 'body':
          case 'bodyUsed':
            return response[name];
        }
        return target[name];
      },
    });

    for (let key in proxy) {
      if (typeof proxy[key] === 'function') {
        proxy[key] = proxy[key].bind(newResponse);
      }
    }

    return proxy;
  });
};
myFetch();
new myXML();
export const handleOpenMock = (isOpen) => {
  if (isOpen) {
    console.log('开启');
    window.XMLHttpRequest = myXML;
    window.fetch = myFetch;
    return;
  }
  console.log('禁用');
  window.XMLHttpRequest = sourceXML;
  window.fetch = sourceFetch;
};
export const toPageEvent = (event) => {
  const { apis, openMock } = getSession();
  handleOpenMock(openMock);
};
window.addEventListener(typeEvent.toPage, toPageEvent);

export default myXML;
