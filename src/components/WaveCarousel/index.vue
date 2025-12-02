<!--
 * @Author       : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @Date         : 2025-12-01 22:01:26
 * @LastEditors  : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @LastEditTime : 2025-12-02 21:43:22
 * @FilePath     : \iosbanner-vue\src\components\WaveCarousel\index.vue
 * @Description  : 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { provide } from "vue";
import GridView from "./GridView.vue";
import DetailView from "./DetailView.vue";
import { useCarousel } from "@/composables/useCarousel";
import type { SlideItem, CarouselOptions } from "@/types/carousel";

interface Props {
  /** 自定义轮播数据（可选，用于接口对接） */
  data?: SlideItem[];
  /** 轮播配置 */
  options?: CarouselOptions;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    autoPlayInterval: 5000,
    autoPlay: true,
    showIntroAnimation: true,
  }),
});

// 使用轮播组合式函数
const carousel = useCarousel(props.options);

// 如果传入了自定义数据，则使用自定义数据
if (props.data) {
  carousel.setSlides(props.data);
}

// 提供给子组件
provide("carousel", carousel);

/**
 * 处理网格选择
 */
const handleGridSelect = (index: number, _event: MouseEvent) => {
  carousel.enterDetail(index);
};

/**
 * 处理幻灯片切换
 */
const handleGoToSlide = (index: number) => {
  carousel.goToSlide(index);
};

// 暴露方法给父组件（用于接口对接）
defineExpose({
  setSlides: carousel.setSlides,
  next: carousel.next,
  prev: carousel.prev,
  goToSlide: carousel.goToSlide,
  currentIndex: carousel.currentIndex,
  slides: carousel.slides,
});
</script>

<template>
  <div class="wave-carousel">
    <!-- 网格预览页 -->
    <GridView
      :slides="carousel.slides.value"
      :show-intro="carousel.showIntro.value"
      @select="handleGridSelect"
    />

    <!-- 详情展示页 -->
    <DetailView
      :slides="carousel.slides.value"
      :current-index="carousel.currentIndex.value"
      :is-animating="carousel.isAnimating.value"
      :active="carousel.isDetailView.value"
      :part-label="carousel.partLabel.value"
      @go-to-slide="handleGoToSlide"
    />
  </div>
</template>

<style scoped>
.wave-carousel {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
