import { wapperKey } from '@/store/modules/apis';
import { parse } from '@/store/modules/apis';
export const fromType = {
  Kepler: 'Kepler',
  Owner: 'Owner',
};
export const toObj = (schema) => {
  try {
    return parse(schema);
  } catch (err) {
    return new Error('schema 格式不对', schema);
  }
};
// interface OwernSchemaPaths{
//   uri: string;
//   desc: string;
//   method: string;
//   code: number;
//   response: {
//     200: any
//   }

// }
// interface OwernSchema {
//   info: {
//     title: string;
//   },
//   paths: OwernSchemaPaths[]
// }
export const vaildSchemaOwner = (schema) => {
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
  if (!Array.isArray(schemaWapper.paths)) {
    return new Error('必须为数组');
  }
  for (let item in schemaWapper.paths) {
    if (item.hasOwnProperty('desc')) {
      return new Error('缺少array[i].desc');
    }
    if (item.hasOwnProperty('uri')) {
      return new Error('缺少array[i].uri');
    }
    if (item.hasOwnProperty('method')) {
      return new Error('缺少array[i].method');
    }
    if (item.hasOwnProperty('code')) {
      return new Error('缺少array[i].code');
    }
    if (item.hasOwnProperty('response')) {
      return new Error('缺少array[i].response');
    }
  }
};

export const vaildSchemaKepler = (schema) => {
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

export const formatSchema2Apis = (apisItem, $index) => {
  const { schema, name } = apisItem;
  const { paths } = schema;
  const tree = {
    label: name,
    id: $index,
    children: paths.map((item) => ({
      label: item.desc,
      detail: { ...item, apisIdx: $index },
    })),
  };
  return tree;
};

// apis模块实现的数据结构
export const kepler2OwernData = (schema) => {
  const { paths, info } = schema;
  const { title } = info;
  const children = [];
  Object.keys(paths).forEach((uri) => {
    const uriPath = paths[uri];
    Object.keys(uriPath).forEach((method, $childId) => {
      const result = uriPath[method];
      children.push({
        desc: result.summary,
        uri,
        method,
        disabled: true,
        finish: false,
        id: `${uri}-${method}`,
        code: 200,
        // 不同状态码对应的response
        response: {
          200: {},
        },
      });
    });
  });
  return {
    info: { title },
    paths: children,
  };
};
