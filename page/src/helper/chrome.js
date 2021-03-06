import { typeEvent, preKey } from './event';
import { parse, stringify } from '@/store/modules/apis';
// 用于插件的数据储存
// 用于传递ajax的数据储存
export const pageKey = 'api_interceptor__session__'
const isPro = process.env.NODE_ENV === 'production';
const chromeMock = {
  runtime: {
    sendMessage(msg, _fn) {
      console.log('sendMessage', msg);
    },
    onMessage: {
      addListener(...args) {
        console.log('addListener');
      },
    },
  },
  storage: {
    local: {
      get(keys, callback) {
        console.log('local get', keys);
        const source = {};
        keys.forEach((key) => {
          source[key] = parse(window.sessionStorage.getItem(`${preKey}${key}`));
        });
        console.log('source', source)
        callback(source);
      },
      set(obj) {
        Object.keys(obj).forEach((item) => {
          window.sessionStorage.setItem(
            `${preKey}${item}`,
            stringify(obj[item])
          );
        });
      },
    },
  },
};
const chromeWapper = isPro ? chrome : chromeMock;

export const sendMessage = (result, callback) => {
  chromeWapper.runtime.sendMessage(
    { type: typeEvent.toContent, result: result },
    callback
  );
};

export const addListener = (callback) => {
  chromeWapper.runtime.onMessage.addListener((event, sender, callable) => {
    callback(event, sender, callable);
  });
};

export const getStore = (keys, callback) => {
  if (isPro) {
    const syncKeys = keys.map((item) => `${preKey}${item}`);
    return chromeWapper.storage.local.get(syncKeys, (result) => {
      const obj = {};
      keys.forEach((key) => {
        const source = result[`${preKey}${key}`];
        if (!source) {
          return;
        }
        obj[key] = parse(source);
      });
      console.log(`get`, keys, result, obj);
      callback(obj);
    });
  }
  return chromeWapper.storage.local.get(keys, callback);
};
export const setStore = (obj) => {
  if (isPro) {
    Object.keys(obj).forEach((key) => {
      const params = {
        [`${preKey}${key}`]: stringify(obj[key]),
      };
      console.log('set', params);
      return chromeWapper.storage.local.set(params);
    });
  }
  return chromeWapper.storage.local.set(obj);
};
export default chromeWapper;
