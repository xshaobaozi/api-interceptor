import { preKey, parse, typeEvent } from './event';
const sourceXML = window.XMLHttpRequest;


const getSession = () => {
  const keys = ['apis', 'openMock'];
  const source = {};
  keys.forEach((key) => {
    source[key] = parse(window.sessionStorage.getItem(`${preKey}${key}`));
  });
  return source;
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
    const { apis } = getSession();
    if (!apis) {
      console.warn('apis找不到');
      return;
    }
    let match = false;
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
          this.responseURL.indexOf(uri) > -1 &&
          String(this._method).toLocaleLowerCase() === methods
        ) {
          return true;
        }
        return false;
      });
      if (!matchTarget) {
        return;
      }
      match = true;
      this.responseText = matchTarget.response;
      this.response = matchTarget.response;
    });
  }
}
new myXML();

const handleOpenMock = (isOpen) => {
  if (isOpen) {
    console.log('开启');
    window.XMLHttpRequest = myXML;
    return;
  }
  console.log('禁用');
  window.XMLHttpRequest = sourceXML;
};
window.addEventListener(typeEvent.toPage, (event) => {
  const { apis, openMock } = getSession();
  handleOpenMock(openMock);
});

export default myXML;
