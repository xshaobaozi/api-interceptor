<template>
  <el-row>
    <el-col :span="24">
      <el-tabs v-model="tabValue">
        <el-tab-pane label="模块管理" name="module">
          <ModuleManager></ModuleManager>
        </el-tab-pane>
        <el-tab-pane label="请求管理" name="api">
          <EditApi></EditApi>
        </el-tab-pane>
        <el-tab-pane v-if="!isPro" label="模拟请求" name="mock">
          <MockView></MockView>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script setup>
import ModuleManager from '@/views/module-manager/index.vue';
import EditApi from '@/views/edit-api/index.vue';
import MockView from '@/views/mock-view/index.vue';
import { ref } from 'vue';
import { useApiStore } from '@/store';
const isPro = process.env.NODE_ENV === 'production';
const apiStore = useApiStore();
apiStore.init();
const tabValue = ref('module');
</script>
<style lang="scss"></style>
