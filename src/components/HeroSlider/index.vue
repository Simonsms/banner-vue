<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { SlideItem } from "@/types/carousel";
import { defaultSlides } from "@/data/slides";
import { fetchCarouselData } from "@/api/carousel";
import { appConfig } from "@/config";

// Swiper CSS
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/effect-fade";

// Props
interface Props {
  data?: SlideItem[];
  showIndicators?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showIndicators: false,
});

// State
const slides = ref<SlideItem[]>(props.data ?? defaultSlides);
const activeIndex = ref(0);
const isLoading = ref(false);

// 动画状态控制
const textVisible = ref(true);
const isFirstLoad = ref(true); // 标记是否为首次加载

// Swiper modules
const modules = [EffectFade, Autoplay];

// 加载数据
const loadSlides = async () => {
  isLoading.value = true;
  try {
    const data = await fetchCarouselData();
    if (data.length > 0) {
      slides.value = data;
    }
  } catch (error) {
    console.error("加载轮播数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// Swiper 实例引用
const swiperInstance = ref<SwiperType | null>(null);

// Swiper 初始化
const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper;
};
// Swiper 切换开始 - 文字不再动画（首次加载后固定）
const onSlideChangeTransitionStart = () => {
  // 首次加载后，文字保持固定不动
  if (isFirstLoad.value) {
    isFirstLoad.value = false;
  }
  // 不再触发文字淡出
};

// Swiper 切换结束 - 更新索引（文字保持固定）
const onSlideChangeTransitionEnd = (swiper: SwiperType) => {
  activeIndex.value = swiper.realIndex;
  // 文字保持固定，不再触发淡入动画
};

// 生命周期
onMounted(() => {
  if (appConfig.useApiData) {
    loadSlides();
  }
});

// 暴露方法
defineExpose({
  slides,
  activeIndex,
  loadSlides,
});
</script>

<template>
  <div class="hero-slider">
    <!-- 背景轮播 - 电影级沉浸式切换 -->
    <Swiper
      :modules="modules"
      effect="fade"
      :speed="1500"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :fade-effect="{ crossFade: true }"
      :grab-cursor="true"
      class="hero-swiper"
      @swiper="onSwiper"
      @slide-change-transition-start="onSlideChangeTransitionStart"
      @slide-change-transition-end="onSlideChangeTransitionEnd"
    >
      <SwiperSlide
        v-for="(slide, index) in slides"
        :key="index"
        class="hero-slide"
      >
        <!-- 背景图容器 - Ken Burns 持续缩放 -->
        <div class="slide-bg-wrapper">
          <div
            class="slide-bg"
            :style="{ backgroundImage: `url(${slide.image})` }"
          ></div>
        </div>

        <!-- 暗色遮罩 -->
        <div class="slide-overlay"></div>
      </SwiperSlide>
    </Swiper>

    <!-- 品牌标题区域 - 左上角 -->
    <div class="brand-overlay brand-overlay--top-left">
      <div class="brand-content" :class="{ 'is-visible': textVisible }">
        <!-- 主标题 - 遮罩揭示 -->
        <div class="text-mask">
          <h1 class="brand-title">深地弧光 绿能"链"动</h1>
        </div>

        <!-- 装饰线 - 工业风格（已移除橙色和蓝色的横线） -->
        <div class="text-mask text-mask--delay-1">
          <div class="decorative-line">
            <span class="line-diamond"></span>
          </div>
        </div>

        <!-- 弧光 SVG -->
        <div class="text-mask text-mask--delay-2">
          <div class="arc-light-container">
            <svg
              class="arc-light"
              viewBox="0 0 400 50"
              preserveAspectRatio="xMidYMid meet"
            >
              <!-- 底层弧线 -->
              <path
                class="arc-base"
                d="M 30 45 Q 200 5 370 45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <!-- 发光弧线 -->
              <path
                class="arc-glow"
                d="M 30 45 Q 200 5 370 45"
                fill="none"
                stroke="url(#arcGradient)"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient
                  id="arcGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stop-color="rgba(255,255,255,0)" />
                  <stop offset="45%" stop-color="rgba(100,180,255,0.9)" />
                  <stop offset="50%" stop-color="rgba(255,255,255,1)" />
                  <stop offset="55%" stop-color="rgba(100,180,255,0.9)" />
                  <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- 副标题 -->
        <div class="text-mask text-mask--delay-3">
          <p class="brand-subtitle">中铁建发展集团 宣</p>
        </div>
      </div>
    </div>

    <!-- 小程序二维码 - 右下角 -->
    <div class="qrcode-overlay">
      <div class="qrcode-container" :class="{ 'is-visible': textVisible }">
        <div class="qrcode-frame">
          <!-- 四角发光装饰点 -->
          <span class="corner-dot corner-dot--tl"></span>
          <span class="corner-dot corner-dot--tr"></span>
          <span class="corner-dot corner-dot--bl"></span>
          <span class="corner-dot corner-dot--br"></span>
          <img
            src="@/assets/images/qrUrl.png"
            alt="小程序二维码"
            class="qrcode-image"
          />
        </div>
        <p class="qrcode-label">扫码进入小程序</p>
      </div>
    </div>

    <!-- 进度指示器 -->
    <div v-if="props.showIndicators" class="slide-indicators">
      <span
        v-for="(_, index) in slides"
        :key="index"
        class="indicator"
        :class="{ 'is-active': activeIndex === index }"
      ></span>
    </div>

    <!-- 当前索引 -->
    <div class="slide-counter">
      <span class="current">{{
        String(activeIndex + 1).padStart(2, "0")
      }}</span>
      <span class="separator">/</span>
      <span class="total">{{ String(slides.length).padStart(2, "0") }}</span>
    </div>

    <!-- 切换指示箭头 -->
    <div class="scroll-hint">
      <div class="scroll-line"></div>
      <span class="scroll-text">SCROLL</span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   Hero Slider - 电影级沉浸式切换
   ============================================ */

.hero-slider {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

.hero-swiper {
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ============================================
   Ken Burns 效果 - 持续缩放动画 (核心)
   ============================================ */

.slide-bg-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.slide-bg {
  position: absolute;
  /* 放大区域以避免缩放时露出边缘 */
  inset: -5%;
  width: 110%;
  height: 110%;
  background-size: cover;
  background-position: center;
  will-change: transform;
  /* 初始状态 */
  transform: scale(1);
}

/* 
 * Ken Burns 持续动画
 * 关键：使用 CSS animation 而非 transition
 * 这样无论 slide 是否 active，动画都在持续运行
 */

/* 当 slide 可见时（包括过渡中），启动 Ken Burns 动画 */
.swiper-slide-visible .slide-bg,
.swiper-slide-active .slide-bg {
  animation: kenBurnsZoom 8s ease-out forwards;
}

/* 非可见状态重置 - 为下次进入准备 */
.swiper-slide:not(.swiper-slide-visible):not(.swiper-slide-active) .slide-bg {
  animation: none;
  transform: scale(1);
}

@keyframes kenBurnsZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.15);
  }
}

/* ============================================
   Swiper Fade 过渡优化 - 长叠化
   ============================================ */

/* 确保 crossFade 效果流畅 - 增强淡入淡出冲击力 */
:deep(.swiper-slide) {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 非活动 slide 完全透明 + 轻微缩小，增强对比冲击力 */
:deep(.swiper-slide:not(.swiper-slide-active)) {
  opacity: 0 !important;
  transform: scale(1.02);
}

/* 保证层叠顺序正确 */
:deep(.swiper-slide-active) {
  z-index: 2;
  opacity: 1 !important;
  transform: scale(1);
}

:deep(.swiper-slide-prev),
:deep(.swiper-slide-next) {
  z-index: 1;
}

/* ============================================
   暗色遮罩 - 增强对比度
   ============================================ */

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.25) 0%,
      rgba(0, 0, 0, 0.15) 30%,
      rgba(0, 0, 0, 0.25) 60%,
      rgba(0, 0, 0, 0.5) 100%
    ),
    radial-gradient(
      ellipse 120% 80% at center 40%,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
  z-index: 1;
  pointer-events: none;
}

/* ============================================
   品牌标题区域
   ============================================ */

.brand-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
  padding: 0 3rem 3rem 0;
}

/* 左上角布局 */
.brand-overlay--top-left {
  align-items: flex-start;
  justify-content: flex-start;
  padding: 3rem 0 0 3rem;
}

.brand-content {
  text-align: center;
  padding: 1rem 1.8rem;
  max-width: 400px;
  /* 降低蒙版透明度，减少模糊效果，使其与背景融合更自然 */
  background: rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(2px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.02);
}

/* ============================================
   小程序二维码区域 - 右下角
   ============================================ */

.qrcode-overlay {
  position: absolute;
  bottom: 3rem;
  right: 3rem;
  z-index: 10;
  pointer-events: none;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.qrcode-container.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.qrcode-frame {
  position: relative;
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 40px rgba(100, 180, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

/* 边框装饰 - 四角发光点动画 */
@keyframes corner-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(100, 180, 255, 0.6);
  }
  50% {
    transform: scale(1.4);
    box-shadow: 0 0 16px rgba(100, 180, 255, 1),
      0 0 24px rgba(100, 180, 255, 0.4);
  }
}

@keyframes corner-orbit {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(90deg);
  }
  50% {
    transform: scale(1) rotate(180deg);
  }
  75% {
    transform: scale(1.2) rotate(270deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}

/* 四角装饰点基础样式 */
.corner-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #64b4ff 0%, #a0d8ff 50%, #64b4ff 100%);
  background-size: 200% 200%;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(100, 180, 255, 0.6);
  pointer-events: none;
  z-index: 5;
  animation: corner-pulse 2.5s ease-in-out infinite;
}

/* 四角定位 */
.corner-dot--tl {
  top: -4px;
  left: -4px;
  animation-delay: 0s;
}

.corner-dot--tr {
  top: -4px;
  right: -4px;
  animation-delay: 0.6s;
}

.corner-dot--bl {
  bottom: -4px;
  left: -4px;
  animation-delay: 1.2s;
}

.corner-dot--br {
  bottom: -4px;
  right: -4px;
  animation-delay: 1.8s;
}

.qrcode-image {
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 6px;
}

.qrcode-label {
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.1em;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* ============================================
   Mask Reveal 遮罩揭示动画
   ============================================ */

.text-mask {
  overflow: hidden;
  position: relative;
}

/* 内部元素的动画 */
.text-mask > * {
  transform: translateY(110%);
  opacity: 0;
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease;
}

/* 可见状态 - 文字上升进入 */
.brand-content.is-visible .text-mask > * {
  transform: translateY(0);
  opacity: 1;
}

/* 退出状态 - 文字下降退出 */
.brand-content:not(.is-visible) .text-mask > * {
  transform: translateY(-30%);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.4, 0, 1, 1), opacity 0.4s ease;
}

/* 延迟队列 - 错落入场 */
.text-mask--delay-1 > * {
  transition-delay: 0.12s;
}

.text-mask--delay-2 > * {
  transition-delay: 0.24s;
}

.text-mask--delay-3 > * {
  transition-delay: 0.36s;
}

/* 退出时不需要延迟 */
.brand-content:not(.is-visible) .text-mask--delay-1 > *,
.brand-content:not(.is-visible) .text-mask--delay-2 > *,
.brand-content:not(.is-visible) .text-mask--delay-3 > * {
  transition-delay: 0s;
}

/* ============================================
   主标题样式
   ============================================ */

.brand-title {
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  font-size: clamp(1.3rem, 3vw, 2rem);
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 0.08em;
  margin: 0 0 0.8rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5), 0 8px 40px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  white-space: nowrap;
}

/* 高亮文字 */
.title-highlight {
  font-weight: 700;
  font-size: 1.05em;
  color: #ffffff;
  /* 动画效果暂时注释
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #64b4ff 40%,
    #ffffff 60%,
    #64b4ff 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleShimmer 4s ease-in-out infinite;
  */
}

/* 动画效果暂时注释
@keyframes titleShimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
*/

.title-normal {
  font-weight: 300;
}

/* ============================================
   装饰线 - 工业风格
   ============================================ */

.decorative-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin: 0.6rem 0 1rem;
}

.line-segment {
  width: clamp(40px, 12vw, 80px);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  position: relative;
}

.line-left {
  animation: lineExpandLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.line-right {
  animation: lineExpandRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

@keyframes lineExpandLeft {
  from {
    transform: scaleX(0);
    transform-origin: right center;
  }
  to {
    transform: scaleX(1);
    transform-origin: right center;
  }
}

@keyframes lineExpandRight {
  from {
    transform: scaleX(0);
    transform-origin: left center;
  }
  to {
    transform: scaleX(1);
    transform-origin: left center;
  }
}

.line-diamond {
  width: 6px;
  height: 6px;
  background: #64b4ff;
  transform: rotate(45deg);
  box-shadow: 0 0 8px rgba(100, 180, 255, 0.8),
    0 0 16px rgba(100, 180, 255, 0.4);
  animation: diamondPulse 2s ease-in-out infinite;
}

@keyframes diamondPulse {
  0%,
  100% {
    opacity: 0.8;
    box-shadow: 0 0 10px rgba(100, 180, 255, 0.8),
      0 0 20px rgba(100, 180, 255, 0.4);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 15px rgba(100, 180, 255, 1),
      0 0 30px rgba(100, 180, 255, 0.6);
  }
}

/* ============================================
   弧光装饰线 - SVG 动画
   ============================================ */

.arc-light-container {
  width: clamp(180px, 35vw, 300px);
  margin: 0 auto 1rem;
}

.arc-light {
  width: 100%;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 0 8px rgba(100, 180, 255, 0.5));
}

.arc-base {
  animation: arcPulse 2.5s ease-in-out infinite;
}

@keyframes arcPulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

.arc-glow {
  stroke-dasharray: 60 340;
  animation: arcFlow 3s linear infinite;
  filter: drop-shadow(0 0 4px rgba(100, 180, 255, 0.9))
    drop-shadow(0 0 10px rgba(100, 180, 255, 0.5));
}

@keyframes arcFlow {
  0% {
    stroke-dashoffset: 400;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

/* ============================================
   副标题样式
   ============================================ */

.brand-subtitle {
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  font-size: clamp(0.7rem, 1.4vw, 0.95rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5em;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
}

/* ============================================
   进度指示器
   ============================================ */

.slide-indicators {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 0.75rem;
}

.indicator {
  width: 50px;
  height: 2px;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
  position: relative;
}

.indicator::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #64b4ff, #ffffff);
  transition: width 5s linear;
}

.indicator.is-active {
  background: rgba(255, 255, 255, 0.35);
}

.indicator.is-active::after {
  width: 100%;
}

/* ============================================
   计数器
   ============================================ */

.slide-counter {
  position: absolute;
  top: 3rem;
  right: 3rem;
  z-index: 10;
  font-family: "Roboto Mono", "SF Mono", monospace;
  font-size: 0.9rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.15em;
}

.slide-counter .current {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(100, 180, 255, 0.5);
}

.slide-counter .separator {
  margin: 0 0.6rem;
  opacity: 0.4;
}

/* ============================================
   滚动提示
   ============================================ */

.scroll-hint {
  position: absolute;
  bottom: 3rem;
  left: 3rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.scroll-line {
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent);
  position: relative;
  overflow: hidden;
}

.scroll-line::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: #64b4ff;
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(250%);
    opacity: 0;
  }
}

.scroll-text {
  font-family: "Roboto", sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.25em;
  writing-mode: vertical-lr;
  text-orientation: mixed;
}

/* ============================================
   响应式
   ============================================ */

@media (max-width: 768px) {
  .brand-overlay--top-left {
    padding: 2rem 0 0 1.5rem;
  }

  .brand-content {
    padding: 1rem 1.5rem;
    max-width: 85%;
  }

  .brand-title {
    font-size: clamp(1.3rem, 6vw, 2rem);
    letter-spacing: 0.08em;
    margin-bottom: 0.8rem;
  }

  .decorative-line {
    margin: 0.8rem 0 1rem;
    gap: 0.6rem;
  }

  .line-segment {
    width: clamp(40px, 12vw, 80px);
  }

  .line-diamond {
    width: 6px;
    height: 6px;
  }

  .arc-light-container {
    width: clamp(140px, 50vw, 220px);
    margin-bottom: 0.8rem;
  }

  .brand-subtitle {
    font-size: clamp(0.6rem, 2vw, 0.8rem);
    letter-spacing: 0.3em;
  }

  .slide-indicators {
    bottom: 2rem;
  }

  .indicator {
    width: 30px;
  }

  .slide-counter {
    top: 2rem;
    right: 1.5rem;
    font-size: 0.75rem;
  }

  .slide-counter .current {
    font-size: 1.4rem;
  }

  .scroll-hint {
    left: 1.5rem;
    bottom: 2rem;
  }

  .scroll-line {
    height: 35px;
  }

  .scroll-text {
    font-size: 0.55rem;
  }

  /* 二维码响应式 */
  .qrcode-overlay {
    bottom: 2rem;
    right: 1.5rem;
  }

  .qrcode-image {
    width: 80px;
    height: 80px;
  }

  .qrcode-frame {
    padding: 8px;
  }

  .qrcode-label {
    font-size: 0.65rem;
  }
}

/* 超小屏幕 */
@media (max-width: 480px) {
  .brand-overlay--top-left {
    padding: 1.5rem 0 0 1rem;
  }

  .brand-content {
    padding: 0.8rem 1.2rem;
  }

  .brand-title {
    font-size: clamp(1.1rem, 6.5vw, 1.6rem);
  }

  .title-highlight {
    font-size: 1em;
  }

  .decorative-line {
    display: none;
  }

  .scroll-hint {
    display: none;
  }

  /* 二维码超小屏幕 */
  .qrcode-overlay {
    bottom: 1.5rem;
    right: 1rem;
  }

  .qrcode-image {
    width: 70px;
    height: 70px;
  }

  .qrcode-frame {
    padding: 6px;
    border-radius: 8px;
  }

  .qrcode-label {
    font-size: 0.6rem;
  }

  .corner-dot {
    width: 6px;
    height: 6px;
  }

  .corner-dot--tl {
    top: -3px;
    left: -3px;
  }

  .corner-dot--tr {
    top: -3px;
    right: -3px;
  }

  .corner-dot--bl {
    bottom: -3px;
    left: -3px;
  }

  .corner-dot--br {
    bottom: -3px;
    right: -3px;
  }
}
</style>
