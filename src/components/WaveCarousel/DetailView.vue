<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import type { SlideItem } from "@/types/carousel";

interface Props {
  slides: SlideItem[];
  currentIndex: number;
  isAnimating: boolean;
  active: boolean;
  partLabel: string;
}

interface Emits {
  (e: "go-to-slide", index: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 当前显示的幻灯片
const currentSlide = computed(() => props.slides[props.currentIndex]);

// 主图容器引用
const mainImageContainer = ref<HTMLElement | null>(null);
const mainImage = ref<HTMLImageElement | null>(null);

// 文字动画状态
const textAnimate = ref(false);
const textPlay = ref(false);

// 切换中的下一张图片
const nextSlideIndex = ref<number | null>(null);
const isTransitioning = ref(false);

// 监听索引变化，播放文字动画
watch(
  () => props.currentIndex,
  () => {
    playTextAnimation();
  }
);

// 监听 active 状态
watch(
  () => props.active,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        playTextAnimation();
      });
    }
  }
);

/**
 * 播放文字动画
 */
const playTextAnimation = () => {
  textAnimate.value = true;
  textPlay.value = false;

  nextTick(() => {
    requestAnimationFrame(() => {
      textPlay.value = true;
    });
  });
};

/**
 * 切换幻灯片（带波浪动画）
 */
const handleSlideChange = (targetIndex: number) => {
  if (props.isAnimating || targetIndex === props.currentIndex) return;

  nextSlideIndex.value = targetIndex;
  isTransitioning.value = true;

  // 创建波纹效果
  createRippleEffect();

  emit("go-to-slide", targetIndex);

  // 动画结束后清理状态
  setTimeout(() => {
    nextSlideIndex.value = null;
    isTransitioning.value = false;
  }, 800);
};

/**
 * 创建波纹效果
 */
const createRippleEffect = () => {
  if (!mainImageContainer.value) return;

  const ripple = document.createElement("div");
  ripple.className = "ripple-effect";

  const containerRect = mainImageContainer.value.getBoundingClientRect();
  const size = Math.max(containerRect.width, containerRect.height);

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${containerRect.width / 2 - size / 2}px`;
  ripple.style.top = `${containerRect.height / 2 - size / 2}px`;

  mainImageContainer.value.appendChild(ripple);

  setTimeout(() => ripple.remove(), 800);
};

/**
 * 缩略图点击
 */
const handleThumbClick = (index: number) => {
  handleSlideChange(index);
};
</script>

<template>
  <section class="detail-view" :class="{ active }">
    <div class="detail-container">
      <!-- 左侧文字区 -->
      <div
        class="text-content"
        :class="{ animate: textAnimate, play: textPlay }"
      >
        <div class="part-label">{{ partLabel }}</div>
        <h1 class="title">{{ currentSlide?.name }}</h1>
        <div class="divider"></div>
        <p class="info-item position">职务：{{ currentSlide?.position }}</p>
        <p class="info-item thoughts">感悟：{{ currentSlide?.thoughts }}</p>
      </div>

      <!-- 右侧图片区 -->
      <div class="image-content">
        <div class="main-image-wrapper">
          <div class="main-image-container" ref="mainImageContainer">
            <!-- 当前图片 -->
            <img
              v-if="currentSlide"
              :src="currentSlide.image"
              :alt="currentSlide.name"
              class="main-image"
              :class="{
                current: isTransitioning,
                'current-leave': isTransitioning,
              }"
              ref="mainImage"
            />
            <!-- 下一张图片（切换时显示） -->
            <img
              v-if="nextSlideIndex !== null && slides[nextSlideIndex]"
              :src="slides[nextSlideIndex]!.image"
              :alt="slides[nextSlideIndex]!.title"
              class="main-image next-enter"
            />
          </div>
        </div>

        <!-- 缩略图导航 -->
        <div class="thumbnail-nav">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="thumb-item"
            :class="{ active: index === currentIndex }"
            :data-index="index"
            @click="handleThumbClick(index)"
          >
            <img :src="slide.image" :alt="`缩略图${index + 1}`" />
          </div>
        </div>
      </div>
    </div>

    <!-- 波浪背景装饰 -->
    <div class="wave-decoration">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          class="wave wave1"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <path
          class="wave wave2"
          d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,224C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.detail-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease, visibility 0.6s ease;
  z-index: 20;
}

.detail-view.active {
  opacity: 1;
  visibility: visible;
}

.detail-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 98%;
  max-width: 2000px;
  height: 94%;
  gap: 40px;
  padding: 0 30px;
}

/* 左侧文字区 */
.text-content {
  flex: 0 0 28%;
  padding-right: 30px;
  padding-left: 30px;
}

.part-label {
  display: inline-block;
  padding: 12px 32px;
  background: var(--primary-gradient);
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.2s;
}

.title {
  font-size: 72px;
  font-weight: 700;
  margin-bottom: 30px;
  background: linear-gradient(90deg, var(--text-white), var(--text-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.3s;
}

.divider {
  width: 120px;
  height: 4px;
  background: var(--primary-gradient);
  margin-bottom: 40px;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  animation: scaleIn 0.6s ease forwards;
  animation-delay: 0.4s;
}

.info-item {
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-light);
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
}

.info-item.name {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.5s;
}

.info-item.position {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.6s;
}

.info-item.thoughts {
  font-size: 20px;
  line-height: 2;
  color: rgba(255, 255, 255, 0.8);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.7s;
}

/* 文字重新动画 */
.text-content.animate .part-label,
.text-content.animate .title,
.text-content.animate .divider,
.text-content.animate .info-item {
  animation: none;
  opacity: 0;
  transform: translateY(30px);
}

.text-content.animate .divider {
  transform: scaleX(0);
}

.text-content.animate.play .part-label {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.1s;
}

.text-content.animate.play .title {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.2s;
}

.text-content.animate.play .divider {
  animation: scaleIn 0.6s ease forwards;
  animation-delay: 0.3s;
}

.text-content.animate.play .info-item.name {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.4s;
}

.text-content.animate.play .info-item.position {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.5s;
}

.text-content.animate.play .info-item.thoughts {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.6s;
}

/* 右侧图片区 */
.image-content {
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 30px 80px var(--shadow-color);
}

.main-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

/* 当前显示的图片 */
.main-image.current {
  z-index: 2;
}

/* 下一张图片（进入） */
.main-image.next-enter {
  z-index: 3;
  animation: waveEnter 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 当前图片（离开） */
.main-image.current-leave {
  z-index: 1;
}

/* 缩略图导航 */
.thumbnail-nav {
  display: flex;
  gap: 20px;
  margin-top: 80px;
}

.thumb-item {
  width: 130px;
  height: 85px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3px solid transparent;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.thumb-item.active {
  border-color: var(--primary-orange);
  transform: translateY(-5px);
  animation: thumbPulse 0.5s ease;
}

.thumb-item.active img {
  filter: grayscale(0%);
}

.thumb-item:hover img {
  filter: grayscale(0%);
}

.thumb-item:hover {
  transform: translateY(-8px) scale(1.05);
}

.thumb-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.thumb-item.active::after {
  transform: scaleX(1);
}

/* 波浪背景装饰 */
.wave-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  overflow: hidden;
  pointer-events: none;
}

.wave-decoration svg {
  width: 100%;
  height: 100%;
}

.wave {
  fill: rgba(245, 169, 98, 0.15);
}

.wave1 {
  animation: waveFloat 8s ease-in-out infinite;
}

.wave2 {
  fill: rgba(232, 93, 58, 0.12);
  animation: waveFloat 6s ease-in-out infinite reverse;
}

/* 波纹效果样式 */
:deep(.ripple-effect) {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 169, 98, 0.45) 0%,
    transparent 70%
  );
  transform: scale(0);
  animation: rippleSpread 0.8s ease-out forwards;
  pointer-events: none;
  z-index: 10;
}

/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes waveFloat {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-25px);
  }
}

@keyframes waveEnter {
  0% {
    clip-path: polygon(
      0% 100%,
      10% 100%,
      20% 100%,
      30% 100%,
      40% 100%,
      50% 100%,
      60% 100%,
      70% 100%,
      80% 100%,
      90% 100%,
      100% 100%,
      100% 100%,
      0% 100%
    );
  }
  30% {
    clip-path: polygon(
      0% 70%,
      10% 65%,
      20% 75%,
      30% 60%,
      40% 70%,
      50% 55%,
      60% 65%,
      70% 50%,
      80% 60%,
      90% 55%,
      100% 50%,
      100% 100%,
      0% 100%
    );
  }
  60% {
    clip-path: polygon(
      0% 35%,
      10% 40%,
      20% 30%,
      30% 45%,
      40% 35%,
      50% 25%,
      60% 40%,
      70% 30%,
      80% 20%,
      90% 35%,
      100% 25%,
      100% 100%,
      0% 100%
    );
  }
  100% {
    clip-path: polygon(
      0% 0%,
      10% 0%,
      20% 0%,
      30% 0%,
      40% 0%,
      50% 0%,
      60% 0%,
      70% 0%,
      80% 0%,
      90% 0%,
      100% 0%,
      100% 100%,
      0% 100%
    );
  }
}

@keyframes rippleSpread {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes thumbPulse {
  0% {
    transform: translateY(-5px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.1);
  }
  100% {
    transform: translateY(-5px) scale(1);
  }
}

/* 响应式 */
@media (max-width: 1200px) {
  .detail-container {
    flex-direction: column;
    gap: 30px;
  }

  .text-content {
    flex: none;
    padding-right: 0;
    text-align: center;
  }

  .image-content {
    flex: none;
  }

  .title {
    font-size: 36px;
  }

  .divider {
    margin: 0 auto 20px;
  }
}

@media (max-width: 768px) {
  .thumbnail-nav {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 60px;
  }

  .thumb-item {
    width: 70px;
    height: 45px;
  }
}
</style>
