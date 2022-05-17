<template>
  <el-button @click="handleSend">Axios Get请求</el-button>
  <el-button @click="handleSendXML">XMLHttpRequest Get请求</el-button>
  <el-button @click="handleOpenMock">{{ isMock ? 'Open' : 'Close' }}</el-button>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import XMLMock from '../../helper/mock';
const isMock = ref(false);
const sourceXML = window.XMLHttpRequest;
const handleOpenMock = () => {
  isMock.value = !isMock.value;
  if (isMock.value) {
    window.XMLHttpRequest = XMLMock;
    return;
  }
  window.XMLHttpRequest = sourceXML;
};
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