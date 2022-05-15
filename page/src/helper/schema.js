import { wapperKey } from '@/store/modules/apis';
import { parse } from '@/store/modules/apis'
export const toObj = (schema) => {
  try {
    return JSON.parse(schema);
  } catch (err) {
    return new Error('schema 格式不对', schema);
  }
};

export const vaildSchema = (schema) => {
  const schemaWapper = toObj(schema);
  if (schemaWapper.message) {
    return new Error(schemaWapper.message);
  }
  if (!schemaWapper.info) {
    return new Error('缺少schema.info');
  }
  if (!schemaWapper.info.title) {
    return new Error('缺少schema.info.title');
  }
  if (!schemaWapper.paths) {
    return new Error('缺少schema.paths');
  }
  for (let uri in schemaWapper.paths) {
    const uris = schemaWapper.paths[uri];
    if (Object.keys(uris).length === 0) {
      return new Error(
        `schema.paths ${uri} 缺少get、post、delete、put中任意一种方法`
      );
    }
    for (let method in uris) {
      const hasMethod = ['get', 'post', 'delete', 'put'].includes(method);
      if (!hasMethod) {
        return new Error(
          `schema.paths ${uri} 缺少get、post、delete、put中任意一种方法`
        );
      }
    }
  }
};

export const getSchema = (schema) => {
  vaildSchema(schema);
};

// TODO取数逻辑有问题
export const formatPaths = (paths, $index) => {
  const children = [];
  Object.keys(paths).forEach((uri) => {
    const uriPath = paths[uri];
    Object.keys(uriPath).forEach((methods, $childId) => {
      const result = uriPath[methods];
      const info = result[wapperKey];
      children.push({
        label: result.summary,
        detail: {
          uri,
          methods,
          summary: result.summary,
          // 自定义
          response: {},
          disabled: false,
          finished: false,
          apisIdx: $index,
          ...info,
        },
      });
    });
  });
  return children;
};
export const formatSchema2Apis = (apisItem, $index) => {
  const { schema, name } = apisItem;
  const tree = {
    label: name,
    id: $index,
    children: [],
  };
  tree.children = formatPaths(parse(schema).paths, $index);
  return tree;
};
