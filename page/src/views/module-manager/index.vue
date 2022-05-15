<template>
  <el-row class="p10">
    <el-col :span="24" class="mb10">
      <el-button type="primary" @click="handleCreate">创建</el-button>
    </el-col>
    <el-col :span="24">
      <el-table :data="apiStore.apis">
        <el-table-column prop="name" label="模块名" width="150" />
        <el-table-column prop="create" label="创建时间" width="150" />
        <el-table-column prop="update" label="更新时间" width="150" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-dialog v-model="dialogConfig.isShow" title="编辑" width="80%">
      <section class="p10">
        <el-form :model="form" label-width="80px" label-position="left" :rules="rules" ref="$form">
          <el-form-item label="模块名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="数据源" prop="schema">
            <JsonEdit v-model:value="form.schema" @change="handleSchemaChange"></JsonEdit>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleSave">保存</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </section>

    </el-dialog>

  </el-row>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApiStore } from '@/store';
import { vaildSchema } from '@/helper/schema'
import JsonEdit from '@/components/jsonEdit.vue'
const apiStore = useApiStore();
const instance = getCurrentInstance()
const rules = reactive({
  name: [{ required: true, message: '请输入模块名', trigger: 'change' }],
  schema: [{ required: true, message: '请输入数据源', trigger: 'change' }, {
    validator: (rule, value, callback) => {
      return callback(vaildSchema(value))
    }
  }],
})
const dialogConfig = reactive({
  isShow: false,
  isEdit: false
})
const form = reactive({
  name: '',
  schema: '',
  id: '',
})
const handleSchemaChange = () => {
  instance.refs['$form'].validate(async (valid, fields) => { })
}
const handleEdit = (row) => {
  dialogConfig.isShow = true
  dialogConfig.isEdit = true
  form.name = row.name
  form.id = row.id
  form.schema = row.schema
}
const handleCreate = () => {
  dialogConfig.isShow = true
  dialogConfig.isEdit = false
  form.name = ''
  form.schema = ''
}
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `是否删除【${row.name}】`,
    '删除模块',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      apiStore.remove(row.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
    })
}
const handleSave = () => {
  instance.refs['$form'].validate(async (valid, fields) => {
    if (!valid) {
      return
    }
    if (dialogConfig.isEdit) {
      apiStore.edit(form)
      dialogConfig.isShow = false
      return
    }
    apiStore.add({
      name: form.name,
      schema: form.schema,
    })
    dialogConfig.isShow = false
  })
}
const handleReset = () => {
  form.name = ''
  form.schema = {
    info: {
      title: ''
    },
    paths: {

    }
  }
}
</script>
<style lang="scss">
</style>
