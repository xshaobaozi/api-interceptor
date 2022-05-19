export const typeEvent = {
  toContent: 'toContent',
  toBackGround: 'toBackGround',
  toPanel: 'toPanel',
  toPage: 'toPage'
};

export const actionType = {
  refresh: 'refresh',
};

export const preKey = 'api_interceptor__';

export const parse = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (err) {
    return obj;
  }
};

export const stringify = (obj) => {
  return JSON.stringify(obj);
};
