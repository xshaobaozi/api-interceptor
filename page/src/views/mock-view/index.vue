<template>
  <el-button @click="handleSend">Axios Get请求</el-button>
  <el-button @click="handleSendXML">XMLHttpRequest Get请求</el-button>
  <el-button @click="handleMockStatus" type="primary">{{
    apiStore.openMock ? '关闭Mock' : '开启Mock'
  }}</el-button>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import XMLMock from '../../helper/mock';
import { useApiStore } from '@/store';
const apiStore = useApiStore();
const isMock = ref(false);
const sourceXML = window.XMLHttpRequest;
const handleOpenMock = () => {
  if (apiStore.openMock) {
    window.XMLHttpRequest = sourceXML;
    return;
  }
  window.XMLHttpRequest = XMLMock;
};
const handleMockStatus = () => {
  apiStore.changeGlobalMock(!apiStore.openMock);
  handleOpenMock();
};
handleOpenMock();
const url = 'https://restapi.amap.com/v3/place/text';
const params = 'key=d575ee75cfb2dee118eac9d49927a9b3&keywords=金山软件园';
const json = {
  key: 'd575ee75cfb2dee118eac9d49927a9b3',
  keywords: '金山软件园',
};
const handleSend = () => {
  axios
    .get(url, {
      params: json,
    })
    .then((res) => {
      console.log(res);
    });
};

const handleSendXML = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', `${url}?${params}`, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log(JSON.parse(xhr.responseText));
    }
  };
};
</script>
