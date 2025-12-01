<script setup lang="ts">
import WaveCarousel from "@/components/WaveCarousel/index.vue";
</script>

<template>
  <WaveCarousel />
</template>

<style>
/* 全局样式变量 - 温暖橙色渐变主题 */
:root {
  /* 主渐变：从亮黄到深红 */
  --primary-gradient: linear-gradient(
    135deg,
    #f5a962 0%,
    #e85d3a 50%,
    #c83a2d 100%
  );
  /* 主色调 */
  --primary-orange: #f08a4b;
  --primary-red: #e85d3a;
  --primary-deep-red: #c83a2d;
  /* 亮色调 */
  --accent-light: #ffe4c4;
  --accent-gold: #ffd4a3;
  /* 背景渐变：从左到右的温暖过渡 */
  --bg-dark: #d74029;
  --bg-gradient: linear-gradient(
    to right,
    #ffe4c4 0%,
    #f5a962 25%,
    #f08a4b 45%,
    #e85d3a 70%,
    #c83a2d 100%
  );
  --text-white: #ffffff;
  --text-light: #fff5e6;
  --shadow-color: rgba(200, 58, 45, 0.35);
}

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
  background: var(--bg-gradient);
  color: var(--text-white);
}

#app {
  width: 100%;
  height: 100%;
}
</style>
