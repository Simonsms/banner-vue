<script setup lang="ts">
import HeroSlider from "@/components/HeroSlider/index.vue";
</script>

<template>
  <HeroSlider />
</template>

<style>
/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

body {
  background: #0a0a0a;
  color: #ffffff;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
