<template>
  <button @click="handleClick">button</button>
</template>

<script setup>
import chromeWapper, { sendMessage } from "@/helper/chrome";
const handleClick = () => {
  console.log("handleClick");
  sendMessage(
    { a: 1, b: 2 },
    function () {
      console.log("调用成功 button 1");
    }
  );
};
</script>
<style lang="scss">
</style>e
