import { wapperKey } from '@/store/modules/apis';
import { parse } from '@/store/modules/apis';
import { processID } from '@/store/modules/apis';
const clone = require('clone');
export const fromType = {
  Kepler: 'Kepler',
  Owner: 'Owner',
  All: 'All',
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
export const vaildSchemaOwner = (schema, isAll = false) => {
  const schemaWapper = toObj(schema);
  if (typeof schemaWapper === 'string') {
    return new Error('格式错误');
  }
  if (!isAll) {
    if (!schemaWapper.hasOwnProperty('info')) {
      return new Error('缺少info.title');
    }
    if (!schemaWapper.info.title) {
      return new Error('缺少info.title');
    }
  }
  if (!schemaWapper.paths) {
    return new Error('缺少paths');
  }
  if (!Array.isArray(schemaWapper.paths)) {
    return new Error('必须为数组');
  }
  for (let item in schemaWapper.paths) {
    if (!schemaWapper.paths[item].hasOwnProperty('desc')) {
      return new Error('缺少array[i].desc');
    }
    if (!schemaWapper.paths[item].hasOwnProperty('uri')) {
      return new Error('缺少array[i].uri');
    }
    if (!schemaWapper.paths[item].hasOwnProperty('methods')) {
      return new Error('缺少array[i].methods');
    }
    if (!schemaWapper.paths[item].hasOwnProperty('code')) {
      return new Error('缺少array[i].code');
    }
    if (!schemaWapper.paths[item].hasOwnProperty('response')) {
      return new Error('缺少array[i].response');
    }
  }
};
export const vaildSchemaAll = (schema) => {
  const schemaWapper = toObj(schema);
  if (schemaWapper.message) {
    return new Error('');
  }
  if (!schemaWapper.schema) {
    return new Error('缺少schema.schema');
  }
  if (!Array.isArray(schemaWapper.schema)) {
    return new Error('schema.schema 必须为array');
  }

  for (let item in schemaWapper.schema) {
    const flag = vaildSchemaOwner(schemaWapper.schema[item].schema);
    if (flag !== true) {
      return flag;
    }
  }
};
export const vaildSchemaKepler = (schema, isAll = false) => {
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
    Object.keys(uriPath).forEach((methods, $childId) => {
      const result = uriPath[methods];
      children.push({
        desc: result.summary,
        uri,
        methods,
        disabled: true,
        finish: false,
        id: processID(),
        code: 200,
        // 不同状态码对应的response
        response: {},
      });
    });
  });
  return {
    info: { title },
    paths: children,
  };
};

export const schemaMerge = (oldSchema, newSchema) => {
  const { paths: oldPaths } = oldSchema;
  const { paths: newPaths } = newSchema;
  const paths = clone(oldPaths);
  newPaths.forEach((newItem) => {
    const idx = paths.findIndex((oldItem) => oldItem.id === newItem.id);
    if (idx === -1) {
      paths.push(newItem);
      return;
    }
    paths[idx].desc = newItem.desc;
    // paths[idx].disabled = newItem.disabled
    // paths[idx].finish = newItem.finish
    const res = paths[idx].response;
    paths[idx].response = {
      ...res,
      ...newItem.response,
    };
    // paths[idx].code = newItem.code
  });
  return {
    info: {
      title: newSchema.info.title,
    },
    paths: paths,
  };
};
