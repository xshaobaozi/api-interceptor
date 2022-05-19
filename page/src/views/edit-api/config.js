import { ref, getCurrentInstance } from 'vue';
import { useApiStore } from '@/store';
export const useRules = () => {
  const uri = [{ required: true, message: '请输入URI', trigger: 'change' }];
  const methods = [
    { required: true, message: '请选择请求方法', trigger: 'change' },
  ];
  const desc = [
    { required: true, message: '请填写名字', trigger: 'change' },
  ];
  const moduleIdx = [
    { required: true, message: '请选择模块', trigger: 'change' },
  ];
  const response = [
    {
      message: '请选择请求方法',
      trigger: 'change',
      validator: (rule, value, callback) => {
        try {
          parseInt(value);
          callback();
        } catch (err) {
          callback(new Error('请输入JSON格式'));
          return;
        }
      },
    },
  ];
  return { uri, methods, response, moduleIdx };
};
export const useCreateNode = () => {
  const apiStore = useApiStore();
  const instance = getCurrentInstance();
  const dialogInfo = ref({
    isShow: false,
  });
  const formValue = ref({
    uri: '',
    desc: '',
    methods: '',
    disabled: true,
    finish: false,
    response: {},
  });
  const handlIsOpen = (flag) => {
    if (flag) {
      formValue.value = {
        uri: '',
        desc: '',
        methods: '',
        moduleIdx: '',
        disabled: true,
        finish: false,
        response: {},
      };
    }
    dialogInfo.value.isShow = flag;
  };
  const handleSave = () => {
    instance.refs['$formCreate'].validate(async (valid, fields) => {
      if (!valid) {
        return;
      }
      apiStore.addNewNode(formValue.value);
      dialogInfo.value.isShow = false;
    });
  };
  const { uri, response, methods, moduleIdx } = useRules();
  const rules = { uri, response, methods, moduleIdx };
  return {
    rules,
    dialogInfo,
    formValue,
    handlIsOpen,
    handleSave,
  };
};
