import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import { setStore, getStore } from './../../../helper/chrome';
import dayjs from 'dayjs';

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
export const wapperKey = 'interceptor';
const processID = () => {
  const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
  return uuid;
};
const ID = 'apis';
const format = 'YYYY-MM-DD hh:mm';
export default defineStore(ID, {
  state: () => {
    return {
      apis: [],
    };
  },
  actions: {
    init() {
      const keys = ['apis'];
      console.log(`初始化state:`, keys);
      getStore(keys, (result) => {
        console.log('getStore', result);
        keys.forEach((key) => {
          const getSource = result[key];
          if (getSource !== undefined && getSource !== null) {
            this[key] = getSource;
          }
        });
      });
    },
    saveLocal() {
      console.log('保存到local ', this.apis);
      setStore({ apis: this.apis });
    },
    add(form) {
      const { name } = form;
      if (this.apis.find((item) => item.name === name)) {
        ElMessage({
          type: 'warn',
          message: `【${name}】已存在`,
        });
        return;
      }
      this.apis.push({
        id: processID(),
        name: form.name,
        schema: form.schema,
        create: dayjs(new Date()).format(format),
        update: dayjs(new Date()).format(format),
      });
      this.saveLocal();
    },
    remove(id) {
      const index = this.apis.findIndex((item) => item.id === id);
      this.apis.splice(index, 1);
      this.saveLocal();
    },
    edit(form) {
      const { id } = form;
      const target = this.apis.find((item) => item.id === id);
      if (!target) {
        ElMessage({
          type: 'danger',
          message: `找不到【${name}】`,
        });
        return;
      }
      target.name = form.name;
      target.schema = form.schema;
      target.update = dayjs(new Date()).format(format);
      this.saveLocal();
    },
    // TODO修改数据逻辑有问题
    editItem(formValue) {
      const { apisIdx } = formValue;
      const target = this.apis[apisIdx];
      if (!target) {
        return;
      }
      const { uri, method } = formValue;
      try {
        const paths = target['schema']['paths'];
        const idx = paths.findIndex((item) => item.id === `${uri}-${method}`);
        if (idx === -1) {
          return Error('找不到', uri, method);
        }
        paths[idx] = formValue;
        // Object.keys(formValue).forEach((key) => {
        //   result[key] = formValue[key];
        // });
        this.saveLocal();
      } catch (err) {
        console.log(target, formValue);
        ElMessage({
          type: 'warn',
          message: `修改数据失败${err.message}`,
        });
      }
    },
  },
});
