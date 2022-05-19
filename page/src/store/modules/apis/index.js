import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import { setStore, getStore } from './../../../helper/chrome';
import { schemaMerge } from '@/helper/schema';
import { sendMessage } from '@/helper/chrome';
import { actionType } from '@/helper/event';
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
export const processID = () => {
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
      openMock: false,
    };
  },
  actions: {
    addNewNode(formValue) {
      const { moduleIdx, ...otherProps } = formValue;
      const target = this.apis[moduleIdx];
      if (!target) {
        return;
      }
      target.schema.paths.push({ id: processID(), ...otherProps });
      this.saveLocal();
    },
    changeGlobalMock(flag) {
      this.openMock = flag;
      this.saveLocal();
    },
    init() {
      const keys = ['apis', 'openMock'];
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
      console.log('保存到local ', this.apis, this.openMock);
      setStore({ apis: this.apis, openMock: this.openMock });
      sendMessage(
        {
          apis: this.apis,
          action: actionType.refresh,
          openMock: this.openMock,
        },
        (...args) => {
          console.log('sendMessage', ...args);
        }
      );
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
    removeItem(idx, id) {
      const target = this.apis[idx];
      if (!target) {
        return;
      }
      const index = target.schema.paths.findIndex((item) => item.id === id);
      target.schema.paths.splice(index, 1);
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
      target.disabled = form.disabled;
      target.update = dayjs(new Date()).format(format);
      //合并数据
      target.schema = form.merge
        ? schemaMerge(target.schema, form.schema)
        : form.schema;
      this.saveLocal();
    },
    editAll(apis) {
      this.apis = apis;
      this.saveLocal();
    },
    // TODO修改数据逻辑有问题
    editItem(formValue) {
      const { apisIdx } = formValue;
      const target = this.apis[apisIdx];
      if (!target) {
        return;
      }
      console.log(target);
      const { uri, methods, id } = formValue;
      try {
        const paths = target['schema']['paths'];
        const idx = paths.findIndex((item) => item.id === id);
        console.log(idx);
        if (idx === -1) {
          throw Error('找不到', uri, methods);
        }
        paths[idx] = formValue;
        console.log('formValue', formValue);
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
