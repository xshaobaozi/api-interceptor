<template>
  <section class="edit-api">
    <section class="edit-api__left">
      <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"
        :default-expanded-keys="treeInfo.expandKey" node-key="label" />
    </section>
    <section v-if="currentForm.uri" class="edit-api__right pl15">
      <el-form :model="currentForm" label-width="80px" label-position="left" :rules="rules" ref="$form">
        <el-form-item label="URI" prop="uri">
          <el-input v-model="currentForm.uri" />
        </el-form-item>
        <el-form-item label="描述" prop="summary">
          <el-input v-model="currentForm.summary" />
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
            <el-radio-button :label="true">启动</el-radio-button>
            <el-radio-button :label="false">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成" prop="finished">
          <el-radio-group v-model="currentForm.finished" size="small">
            <el-radio-button :label="true">完成</el-radio-button>
            <el-radio-button :label="false">未完成</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="返回" prop="response">
          <JsonEdit v-model:value="currentForm.response"></JsonEdit>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSave">保存</el-button>
          <el-button size="small" type="danger" @click="handleDelete">删除</el-button>
        </el-form-item>
      </el-form>
    </section>
  </section>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useApiStore } from '@/store';
import { formatSchema2Apis } from '@/helper/schema'
import JsonEdit from '@/components/jsonEdit.vue'
const apiStore = useApiStore();
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeInfo = reactive({
  expandKey: [],
  checkKey: []
})

const currentForm = ref({ uri: '', summary: '', methods: '', response: {}, finished: false, disabled: false }
)
const menus = computed(() => {
  const source = apiStore.apis.map(formatSchema2Apis)
  return source
})

const handleNodeClick = (info) => {
  const { apisIdx } = info.detail
  const faterName = apiStore.apis[apisIdx].name
  treeInfo.expandKey = [faterName, info.label]
  currentForm.value = { ...info.detail }
}
const form = reactive({})
const rules = reactive({})
const handleSave = () => {
  apiStore.editItem(currentForm.value)
}
const handleDelete = () => { }
const renderContent = (h, { node, data, store }) => {
  if (!data.detail) {
    return h('h', { class: `fz12 ` }, node.label)
  }
  const { finished } = data.detail;
  return h('h', { class: `fz12 ${finished ? 'success-icon' : 'danger-icon'}` }, node.label)
}
</script>

<style scope lang="scss">
.edit-api {
  display: flex;

  .edit-api__left {
    width: 200px;
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