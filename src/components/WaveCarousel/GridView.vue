<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { SlideItem } from "@/types/carousel";

interface Props {
  slides: SlideItem[];
  showIntro: boolean;
}

interface Emits {
  (e: "select", index: number, event: MouseEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const gridItems = ref<HTMLElement[]>([]);
const isVisible = ref(true);
const isFading = ref(false);

// 入场动画
onMounted(() => {
  if (props.showIntro) {
    // 添加入场动画类
    gridItems.value.forEach((item) => {
      item?.classList.add("intro-animate");
    });

    // 2.2秒后开始淡出
    setTimeout(() => {
      isFading.value = true;
    }, 2200);

    // 3秒后自动进入详情页
    setTimeout(() => {
      emit("select", 0, {} as MouseEvent);
    }, 3000);
  }
});

// 监听显示状态
watch(
  () => props.showIntro,
  (newVal) => {
    if (!newVal) {
      isVisible.value = false;
    }
  }
);

const handleClick = (index: number, event: MouseEvent) => {
  emit("select", index, event);
};

const setGridItemRef = (el: any, index: number) => {
  if (el) gridItems.value[index] = el;
};
</script>

<template>
  <section
    class="grid-view"
    :class="{ hidden: !isVisible, 'fade-to-detail': isFading }"
    v-show="showIntro || isVisible"
  >
    <div class="grid-container">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="grid-item"
        :data-index="index"
        :ref="(el) => setGridItemRef(el, index)"
        @click="handleClick(index, $event)"
      >
        <img :src="slide.image" :alt="slide.title" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  position: relative;
  z-index: 10;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.grid-view.hidden {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
  display: none;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 420px);
  grid-template-rows: repeat(2, 260px);
  gap: 25px;
  padding: 20px;
}

/* 品字形布局调整 */
.grid-item:nth-child(4) {
  grid-column: 1 / 2;
  margin-left: 222px;
}

.grid-item:nth-child(5) {
  grid-column: 2 / 3;
  margin-left: 222px;
}

.grid-item:nth-child(6) {
  grid-column: 3 / 4;
  margin-left: 222px;
}

.grid-item {
  width: 420px;
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 10px 40px var(--shadow-color);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease;
}

.grid-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.grid-item:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 60px var(--shadow-color);
}

.grid-item:hover::before {
  opacity: 0.2;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.grid-item:hover img {
  transform: scale(1.1);
}

/* 首屏入场动画 */
@keyframes zoomInOut {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  40% {
    transform: scale(1.15);
    opacity: 1;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.grid-item.intro-animate {
  opacity: 0;
  transform: scale(0.3);
  animation: zoomInOut 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.grid-item:nth-child(1).intro-animate {
  animation-delay: 0s;
}
.grid-item:nth-child(2).intro-animate {
  animation-delay: 0.15s;
}
.grid-item:nth-child(3).intro-animate {
  animation-delay: 0.3s;
}
.grid-item:nth-child(4).intro-animate {
  animation-delay: 0.45s;
}
.grid-item:nth-child(5).intro-animate {
  animation-delay: 0.6s;
}
.grid-item:nth-child(6).intro-animate {
  animation-delay: 0.75s;
}

/* 首屏淡出动画 */
.grid-view.fade-to-detail {
  animation: fadeOutToDetail 0.8s ease forwards;
}

@keyframes fadeOutToDetail {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
    pointer-events: none;
  }
}

/* 响应式 */
@media (max-width: 1400px) {
  .grid-container {
    grid-template-columns: repeat(3, 350px);
    grid-template-rows: repeat(2, 220px);
    gap: 20px;
  }

  .grid-item {
    width: 350px;
    height: 220px;
  }

  .grid-item:nth-child(4),
  .grid-item:nth-child(5),
  .grid-item:nth-child(6) {
    margin-left: 185px;
  }
}

@media (max-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(3, 300px);
    grid-template-rows: repeat(2, 190px);
    gap: 15px;
  }

  .grid-item {
    width: 300px;
    height: 190px;
  }

  .grid-item:nth-child(4),
  .grid-item:nth-child(5),
  .grid-item:nth-child(6) {
    margin-left: 157px;
  }
}

@media (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(2, 280px);
    grid-template-rows: repeat(3, 175px);
    gap: 15px;
  }

  .grid-item:nth-child(4),
  .grid-item:nth-child(5),
  .grid-item:nth-child(6) {
    margin-left: 0;
  }

  .grid-item {
    width: 280px;
    height: 175px;
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 200px);
    grid-template-rows: repeat(3, 130px);
    gap: 15px;
  }

  .grid-item:nth-child(4),
  .grid-item:nth-child(5),
  .grid-item:nth-child(6) {
    margin-left: 0;
  }

  .grid-item {
    width: 200px;
    height: 130px;
  }
}
</style>
