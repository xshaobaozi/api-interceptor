<template>
  <el-row class="p10">
    <el-col :span="24" class="mb10">
      <el-button size="small" type="primary" @click="handleCreate">创建</el-button>
      <el-button size="small" type="primary" @click="handleAllImport">全量导入</el-button>
      <el-button size="small" type="primary" @click="handleExportData" :disabled="apiStore.apis.length === 0">导出数据
      </el-button>
      <el-button size="small" type="primary" @click="handleopenMock" :disabled="apiStore.apis.length === 0">{{
          apiStore.openMock ? '关闭Mock' : '打开Mock'
      }}</el-button>
    </el-col>
    <el-col :span="24">
      <el-table :data="apiStore.apis" class="modules_manger_table">
        <el-table-column prop="name" label="模块名" width="100" />
        <el-table-column prop="create" label="创建时间" width="150" />
        <el-table-column prop="update" label="更新时间" width="150" />
        <el-table-column label="启用" prop="disabled" width="60">
          <template #default="scope">
            {{ scope.row.disabled ? '禁用' : '启用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleChangeDisabled(scope.row, false)">启用</el-button>
            <el-button size="small" type="danger" @click="handleChangeDisabled(scope.row, true)">禁用</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-dialog v-model="dialogConfig.isShow" :title="dialogConfig.isEdit === Mode.Edit ? '编辑' : '创建'" width="80%">
      <section class="p10">
        <el-form :model="form" label-width="80px" label-position="left" :rules="rules" ref="$form">
          <el-form-item label="模块名" prop="name" v-if="dialogConfig.isEdit !== Mode.All">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="来源" prop="from" v-if="dialogConfig.isEdit !== Mode.All">
            <el-radio-group v-model="form.from" size="small" @change="handleFromChange">
              <el-radio-button :label="fromType.Owner">插件</el-radio-button>
              <el-radio-button :label="fromType.Kepler">Swagger</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="合并" prop="merge" v-if="dialogConfig.isEdit === Mode.Edit">
            <el-radio-group v-model="form.merge" size="small">
              <el-radio-button :label="true">合并</el-radio-button>
              <el-radio-button :label="false">覆盖</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传">
            <el-upload ref="uploadRef" :auto-upload="false" :on-change="handleUpload" :file-list="fileList"
              :show-file-list="false">
              <template #trigger>
                <el-button size="small" type="primary">上传</el-button>
              </template>
            </el-upload>
            <p style="width: 100%" v-if="dialogConfig.isEdit === Mode.All">
              只支持插件定制格式导入
            </p>
          </el-form-item>
          <el-form-item label="数据源" prop="schema">
            <JsonEdit :refresh="dialogConfig.refresh" v-model:value="form.schema" @change="handleSchemaChange">
            </JsonEdit>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleSave">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
            <!-- <el-button size="small" @click="handleReset">重置</el-button> -->
          </el-form-item>
        </el-form>
      </section>
    </el-dialog>
  </el-row>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useApiStore } from '@/store';
import { saveJSON } from '@/helper/utils';
import {
  vaildSchemaOwner,
  vaildSchemaKepler,
  kepler2OwernData,
  vaildSchemaAll,
  fromType,
} from '@/helper/schema';
import JsonEdit from '@/components/jsonEdit.vue';
const apiStore = useApiStore();
const instance = getCurrentInstance();
const form = reactive({
  name: '',
  from: fromType.Kepler,
  schema: '',
  disabled: true,
  merge: false,
  id: '',
});
const fileList = ref([]);
const handleExportData = () => {
  saveJSON(apiStore.apis);
};
const handleUpload = () => {
  if (fileList.value.length > 1) {
    fileList.value.splice(0, 1);
  }
  const file = fileList.value[0].raw;
  const reader = new FileReader();
  reader.readAsText(file, 'utf8');
  reader.onload = function () {
    try {
      const fileJSON = JSON.parse(this.result);
      form.schema = fileJSON;
      dialogConfig.refresh = !dialogConfig.refresh;
    } catch (err) {
      ElMessage.error('文件格式不正确');
      // form.schema = fileJSON
    }
    handleFromChange();
  };
};
const rules = computed(() => {
  const name = [{ required: true, message: '请输入模块名', trigger: 'change' }];
  const from = [{ required: true, message: '请选择来源', trigger: 'change' }];
  const schema = [
    { required: true, message: '请输入数据源', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (form.from === fromType.Kepler) {
          return callback(vaildSchemaKepler(value));
        }
        if (form.from === fromType.All) {
          return callback(vaildSchemaAll(value));
        }
        return callback(vaildSchemaOwner(value));
      },
    },
  ];
  if (form.from === fromType.All) {
    return {
      schema,
    };
  }
  return {
    name,
    from,
    schema,
  };
});
const Mode = {
  Edit: 'Edit',
  Create: 'Create',
  All: 'All',
};
const dialogConfig = reactive({
  isShow: false,
  isEdit: false,
  refresh: false,
});
const handleClose = () => {
  dialogConfig.isShow = false;
};
const handleopenMock = () => {
  apiStore.changeGlobalMock(!apiStore.openMock);
};
const handleChangeDisabled = (item, disabled) => {
  apiStore.edit({
    ...item,
    disabled: disabled,
  });
};
const handleSchemaChange = () => {
  instance.refs['$form'].validate(async (valid, fields) => { });
};
const handleEdit = (row) => {
  form.name = row.name;
  form.id = row.id;
  form.from = fromType.Owner;
  form.merge = false;
  form.schema = row.schema;
  dialogConfig.isEdit = Mode.Edit;
  dialogConfig.refresh = !dialogConfig.refresh;
  dialogConfig.isShow = true;
};
const handleAllImport = () => {
  dialogConfig.isShow = true;
  dialogConfig.refresh = !dialogConfig.refresh;
  dialogConfig.isEdit = Mode.All;
  form.from = fromType.All;
  form.name = '';
  form.schema = {
    schema: apiStore.apis,
  };
  form.merge = false;
  form.id = '';
  setTimeout(() => {
    handleFromChange();
  }, 0);
};
const handleCreate = () => {
  dialogConfig.refresh = !dialogConfig.refresh;
  dialogConfig.isEdit = Mode.Create;
  form.name = '';
  form.schema = {
    info: {
      title: '模块名字',
    },
    paths: [
      {
        desc: '插件示例模板，自行修改',
        uri: '/api/example',
        methods: 'get',
        disabled: true,
        finish: false,
        code: 200,
        response: {},
      },
    ],
  };
  form.merge = false;
  form.id = '';
  form.from = fromType.Owner;
  dialogConfig.isShow = true;

  nextTick(() => {
    instance.refs['$form'].resetFields();
  });
};
const handleDelete = (row) => {
  ElMessageBox.confirm(`是否删除【${row.name}】`, '删除模块', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      apiStore.remove(row.id);
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    })
    .catch(() => { });
};
const handleFromChange = (val) => {
  instance.refs['$form'].validateField('schema');
};
const handleSave = () => {
  instance.refs['$form'].validate(async (valid, fields) => {
    if (!valid) {
      return;
    }
    if (dialogConfig.isEdit === Mode.Edit) {
      apiStore.edit({
        ...form,
        schema:
          form.from === fromType.Owner
            ? form.schema
            : kepler2OwernData(form.schema),
      });
      dialogConfig.isShow = false;
      return;
    }
    if (dialogConfig.isEdit === Mode.All) {
      apiStore.editAll(form.schema.schema);
      dialogConfig.isShow = false;
      return;
    }
    apiStore.add({
      name: form.name,
      schema:
        form.from === fromType.Owner
          ? form.schema
          : kepler2OwernData(form.schema),
    });
    dialogConfig.isShow = false;
  });
};
const handleReset = () => {
  form.name = '';
  form.id = '';
  form.merge = false;
  form.from = fromType.Owner;
  form.schema = {
    info: {
      title: '',
    },
    paths: [],
  };
};
</script>
<style lang="scss">
.modules_manger_table {
  .cell {
    font-size: 12px;
  }
}
</style>
