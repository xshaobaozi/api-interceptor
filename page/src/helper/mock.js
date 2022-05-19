const sourceXML = window.XMLHttpRequest;
class myXML {
  constructor() {
    const xhr = new sourceXML();
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
            // 请求成功
            console.log('判断是否mock');
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        };
        continue;
      }
      if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          console.log('判断是否mock');
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
              console.log('this', this)
            const resValue =
              this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`];
            console.log(
              'attr',
              attr,
              'get',
              this[`_${attr}`],
              JSON.parse(resValue)
            );
            return { a: 1 };
          },
          set: (val) => {
            console.log('attr', attr, val);
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
    
  }
}
export default myXML;
