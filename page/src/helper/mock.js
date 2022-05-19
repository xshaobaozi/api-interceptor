import { preKey, parse, typeEvent } from './event';
const sourceXML = window.XMLHttpRequest;

// window.addEventListener('message', (event) => {
//   console.log(event, 'message');
// });

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
    const xhr = new sourceXML();
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
            // console.log('this', this);
            const resValue =
              this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`];
            // console.log(
            //   'attr',
            //   attr,
            //   'get',
            //   this[`_${attr}`],
            //   JSON.parse(resValue)
            // );
            return resValue;
          },
          set: (val) => {
            // console.log('attr', attr, val);
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
    const { apis, openMock } = getSession();
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
        if (this.responseURL.indexOf(inner.uri) > -1) {
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
