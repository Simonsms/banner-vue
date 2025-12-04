/**
 * 应用配置
 */
export const appConfig = {
  /**
   * 是否使用接口数据
   * true: 从接口获取轮播数据
   * false: 使用本地 mock 数据
   */
  useApiData: false,
};

/**
 * CDN 配置
 * 使用 jsDelivr 加速 GitHub 图片资源
 */
export const cdnConfig = {
  /**
   * 是否启用 CDN
   */
  enabled: true,

  /**
   * CDN 基础 URL
   * 格式: https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/目录
   *
   * 示例:
   * - GitHub: https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@main/images
   * - 国内备用 CDN:
   *   - gcore: https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images
   *   - fastly: https://fastly.jsdelivr.net/gh/Simonsms/banner-vue@main/images
   */
  baseUrl: "https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images",

  /**
   * 备用 CDN URLs（降级方案）
   */
  fallbackUrls: [
    "https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@main/images",
    "https://fastly.jsdelivr.net/gh/Simonsms/banner-vue@main/images",
  ],
};

/**
 * 获取 CDN 图片 URL
 * @param filename 图片文件名
 * @param useFallback 是否使用备用 CDN（默认 false）
 * @returns 完整的图片 URL
 */
export function getCdnImageUrl(filename: string, useFallback = false): string {
  if (!cdnConfig.enabled) {
    // CDN 未启用时，提示错误
    console.warn(
      `[CDN] CDN is disabled. Please enable CDN in config or use local images.`
    );
    // 返回占位符，避免 Vite 打包本地图片
    return `/images/${filename}`;
  }

  const baseUrl =
    useFallback && cdnConfig.fallbackUrls.length > 0
      ? cdnConfig.fallbackUrls[0]
      : cdnConfig.baseUrl;

  return `${baseUrl}/${filename}`;
}

/**
 * 预加载图片（带降级处理）
 * @param url 图片 URL
 * @returns Promise
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      // CDN 加载失败，尝试备用 CDN
      const filename = url.split("/").pop() || "";
      if (cdnConfig.fallbackUrls.length > 0) {
        const fallbackUrl = `${cdnConfig.fallbackUrls[0]}/${filename}`;
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve();
        fallbackImg.onerror = reject;
        fallbackImg.src = fallbackUrl;
      } else {
        reject(new Error(`Failed to load image: ${url}`));
      }
    };
    img.src = url;
  });
}
