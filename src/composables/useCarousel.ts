import { ref, computed, onMounted, onUnmounted } from "vue";
import type { SlideItem, CarouselOptions } from "@/types/carousel";
import { defaultSlides } from "@/data/slides";
import { fetchCarouselData } from "@/api/carousel";
import { appConfig } from "@/config";

/**
 * 轮播功能组合式函数
 */
export function useCarousel(options: CarouselOptions = {}) {
  const {
    autoPlayInterval = 5000,
    autoPlay = true,
    showIntroAnimation = true,
  } = options;

  // 响应式状态
  const slides = ref<SlideItem[]>(defaultSlides);
  const currentIndex = ref(0);
  const isAnimating = ref(false);
  // 如果不显示首屏动画，则直接进入详情视图（轮播图）
  const isDetailView = ref(!showIntroAnimation);
  const showIntro = ref(showIntroAnimation);
  const autoPlayTimer = ref<number | null>(null);
  const isLoading = ref(false);

  // 计算属性
  const currentSlide = computed(() => slides.value[currentIndex.value]);
  const partLabel = computed(() => `PART 0${currentIndex.value + 1}`);

  /**
   * 设置轮播数据（用于接口对接）
   */
  const setSlides = (newSlides: SlideItem[]) => {
    slides.value = newSlides;
    currentIndex.value = 0;
  };

  /**
   * 切换到指定幻灯片
   */
  const goToSlide = (index: number, callback?: () => void) => {
    if (isAnimating.value || index === currentIndex.value) return;

    isAnimating.value = true;
    stopAutoPlay();

    // 动画结束后更新索引
    setTimeout(() => {
      currentIndex.value = index;
      isAnimating.value = false;
      callback?.();
      if (autoPlay) startAutoPlay();
    }, 800);

    return index;
  };

  /**
   * 下一张
   */
  const next = () => {
    const nextIndex = (currentIndex.value + 1) % slides.value.length;
    return goToSlide(nextIndex);
  };

  /**
   * 上一张
   */
  const prev = () => {
    const prevIndex =
      (currentIndex.value - 1 + slides.value.length) % slides.value.length;
    return goToSlide(prevIndex);
  };

  /**
   * 开始自动播放
   */
  const startAutoPlay = () => {
    stopAutoPlay();
    if (!autoPlay) return;
    autoPlayTimer.value = window.setInterval(() => {
      next();
    }, autoPlayInterval);
  };

  /**
   * 停止自动播放
   */
  const stopAutoPlay = () => {
    if (autoPlayTimer.value) {
      clearInterval(autoPlayTimer.value);
      autoPlayTimer.value = null;
    }
  };

  /**
   * 进入详情页
   */
  const enterDetail = (index?: number) => {
    if (typeof index === "number") {
      currentIndex.value = index;
    }
    isDetailView.value = true;
    showIntro.value = false;
    startAutoPlay();
  };

  /**
   * 退出详情页
   */
  const exitDetail = () => {
    stopAutoPlay();
    isDetailView.value = false;
  };

  /**
   * 键盘控制
   */
  const handleKeydown = (e: KeyboardEvent) => {
    if (!isDetailView.value) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next();
    } else if (e.key === "Escape") {
      exitDetail();
    }
  };

  /**
   * 从接口加载轮播数据
   */
  const loadSlides = async () => {
    isLoading.value = true;
    try {
      const data = await fetchCarouselData();
      if (data.length > 0) {
        slides.value = data;
      }
    } catch (error) {
      console.error("加载轮播数据失败:", error);
      // 失败时保持默认数据
    } finally {
      isLoading.value = false;
    }
  };

  // 生命周期
  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
    // 根据配置决定是否加载接口数据
    if (appConfig.useApiData) {
      loadSlides();
    }
    // 如果不显示首屏动画，直接启动自动播放
    if (!showIntroAnimation && autoPlay) {
      startAutoPlay();
    }
  });

  onUnmounted(() => {
    stopAutoPlay();
    document.removeEventListener("keydown", handleKeydown);
  });

  return {
    // 状态
    slides,
    currentIndex,
    currentSlide,
    isAnimating,
    isDetailView,
    showIntro,
    partLabel,
    isLoading,
    // 方法
    setSlides,
    loadSlides,
    goToSlide,
    next,
    prev,
    startAutoPlay,
    stopAutoPlay,
    enterDetail,
    exitDetail,
  };
}
