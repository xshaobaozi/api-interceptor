<template>
  <section class="edit-api">
    <section class="edit-api__left">
      <el-button type="primary" class="mb20" @click="handlIsOpen(true)"
        >添加</el-button
      >
      <el-input v-model="filterValue" placeholder="请输入过滤名字"></el-input>
      <el-tree
        :data="menus"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :render-content="renderContent"
        :default-expanded-keys="treeInfo.expandKey"
        node-key="label"
      />
    </section>
    <section v-if="currentForm.id" class="edit-api__right pl15">
      <el-form
        :model="currentForm"
        label-width="80px"
        label-position="left"
        :rules="rules"
        ref="$form"
      >
        <el-form-item label="名字" prop="desc">
          <el-input v-model="currentForm.desc" />
        </el-form-item>
        <el-form-item label="URI" prop="uri">
          <el-input v-model="currentForm.uri" />
        </el-form-item>
        <el-form-item label="方法" prop="methods">
          <el-radio-group v-model="currentForm.methods" size="small">
            <el-radio-button label="get" />
            <el-radio-button label="post" />
            <el-radio-button label="put" />
            <el-radio-button label="delete" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用" prop="disabled">
          <el-radio-group v-model="currentForm.disabled" size="small">
            <el-radio-button :label="true">关闭</el-radio-button>
            <el-radio-button :label="false">启动</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成" prop="finish">
          <el-radio-group v-model="currentForm.finish" size="small">
            <el-radio-button :label="true">完成</el-radio-button>
            <el-radio-button :label="false">未完成</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="返回" prop="response">
          <JsonEdit
            v-model:value="currentForm.response"
            :refresh="treeRefresh"
          ></JsonEdit>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSave"
            >保存</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete"
            >删除</el-button
          >
        </el-form-item>
      </el-form>
    </section>

    <el-dialog v-model="dialogInfo.isShow" title="创建" width="80%">
      <section class="p10">
        <el-form
          :model="formValue"
          label-width="80px"
          label-position="left"
          :rules="dialogRules"
          ref="$formCreate"
        >
          <el-form-item label="名字" prop="desc">
            <el-input v-model="formValue.desc" />
          </el-form-item>
          <el-form-item label="URI" prop="uri">
            <el-input v-model="formValue.uri" />
          </el-form-item>
          <el-form-item label="模块" prop="moduleIdx">
            <el-select v-model="formValue.moduleIdx" placeholder="请选择模块">
              <el-option
                v-for="(item, $index) in apiStore.apis"
                :key="$index"
                :value="$index"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方法" prop="methods">
            <el-radio-group v-model="formValue.methods" size="small">
              <el-radio-button label="get" />
              <el-radio-button label="post" />
              <el-radio-button label="put" />
              <el-radio-button label="delete" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="启用" prop="disabled">
            <el-radio-group v-model="formValue.disabled" size="small">
              <el-radio-button :label="true">启动</el-radio-button>
              <el-radio-button :label="false">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="完成" prop="finish">
            <el-radio-group v-model="formValue.finish" size="small">
              <el-radio-button :label="true">完成</el-radio-button>
              <el-radio-button :label="false">未完成</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="返回" prop="response">
            <JsonEdit
              v-model:value="formValue.response"
              :refresh="treeRefresh"
            ></JsonEdit>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleDialogSave"
              >保存</el-button
            >
            <el-button size="small" @click="handlIsOpen(false)">取消</el-button>
          </el-form-item>
        </el-form>
      </section>
    </el-dialog>
  </section>
</template>

<script setup>
import { ref, computed, reactive, watch, getCurrentInstance } from 'vue';
import { useApiStore } from '@/store';
import { formatSchema2Apis } from '@/helper/schema';
import JsonEdit from '@/components/jsonEdit.vue';
import { useCreateNode, useRules } from './config';
const instance = getCurrentInstance();
const {
  dialogInfo,
  handlIsOpen,
  formValue,
  rules: dialogRules,
  handleSave: handleDialogSave,
} = useCreateNode();
const apiStore = useApiStore();
const defaultProps = {
  children: 'children',
  label: 'label',
};
const treeRefresh = ref(false);
const treeInfo = reactive({
  expandKey: [],
  checkKey: [],
});
const filterValue = ref('');
const currentForm = ref({
  id: '',
  uri: '',
  desc: '',
  method: '',
  response: {},
  finish: false,
  disabled: false,
});
const menus = computed(() => {
  const source = apiStore.apis.map(formatSchema2Apis);
  if (filterValue.value) {
    return source.map((item) => {
      const children = item.children.filter(
        (inner) => inner.label.indexOf(filterValue.value) > -1
      );
      return {
        ...item,
        children,
      };
    });
  }
  return source;
});

const handleNodeClick = (info) => {
  if (!info.detail) {
    return;
  }
  const { apisIdx, id, uri, desc, methods, response, finish, disabled } =
    info.detail;
  const faterName = apiStore.apis[apisIdx].name;
  treeInfo.expandKey = [faterName, info.label];
  currentForm.value = {
    apisIdx,
    id,
    uri,
    desc,
    methods,
    response,
    finish,
    disabled,
  };
  treeRefresh.value = !treeRefresh.value;
};
const form = reactive({});
const rules = computed(() => {
  const { uri, response, methods, moduleIdx } = useRules();
  return {
    uri,
    response,
    methods,
  };
});
const handleSave = () => {
  instance.refs['$form'].validate(async (valid, fields) => {
    if (!valid) {
      return;
    }
    apiStore.editItem({...currentForm.value});
  });
};
const handleDelete = () => {
  const { apisIdx, id } = currentForm.value;
  apiStore.removeItem(apisIdx, id);
  currentForm.value.id = '';
};
const renderContent = (h, { node, data, store }) => {
  if (!data.detail) {
    return h('h', { class: `fz12 ` }, node.label);
  }
  const { disabled, finish } = data.detail;
  return h(
    'h',
    {
      class: `fz12 ${disabled ? 'danger-icon' : 'success-icon'}`,
      title: node.label,
    },
    // [h('span', { class: finish ? 'finish-icon' : '' }, finish ? '完' : '')],
    [h('span', { class: finish ? 'info-color' : 'normal-color' }, node.label)]
  );
};
</script>

<style scope lang="scss">
.edit-api {
  display: flex;
  .finish-icon {
    padding: 2px 4px;
    border: 1px solid #4caf50;
    color: #4caf50;
    border-radius: 4px;
    margin-right: 4px;
  }
  .edit-api__left {
    width: 300px;
    padding-right: 15px;
    border-right: 1px solid #ddd;
    overflow-y: scroll;
    height: calc(100vh - 40px - 32px - 15px);
  }

  .edit-api__right {
    width: 100%;
  }
}
</style>