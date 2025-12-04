import type { SlideItem } from "@/types/carousel";
import { getCdnImageUrl } from "@/config";

/**
 * 图片文件名列表
 * 注意：上传到 GitHub 后，需要将文件名改为简短的英文名
 *
 * 当前使用的图片文件名（需要上传到 GitHub images 目录）：
 * - banner-1.jpg (原: 微信图片_2025-12-03_205657_360.jpg, 7.2MB)
 * - banner-2.jpg (原: 微信图片_2025-12-03_205738_731.jpg, 1.5MB)
 * - banner-3.jpg (原: 微信图片_2025-12-03_205744_150.jpg, 4.6MB)
 * - banner-4.jpg (原: 微信图片_2025-12-03_205748_911.jpg, 4.3MB)
 * - banner-5.jpg (原: 微信图片_2025-12-03_205753_782.jpg, 382KB)
 * - banner-6.jpg (原: 微信图片_2025-12-03_205758_380.jpg, 10.7MB)
 * - banner-7.jpg (原: 微信图片_2025-12-03_205803_450.jpg, 9.1MB)
 * - banner-8.jpg (原: 微信图片_2025-12-03_205807_801.jpg, 12.0MB)
 * - banner-9.jpg (原: 微信图片_2025-12-03_205812_250.jpg, 87KB)
 *
 * 建议：上传前先使用 TinyPNG 或 Squoosh 压缩图片
 */
const imageFiles = [
  "banner-1.jpg",
  "banner-2.jpg",
  "banner-3.jpg",
  "banner-4.jpg",
  "banner-5.jpg",
  "banner-6.jpg",
  "banner-7.jpg",
  "banner-8.jpg",
  "banner-9.jpg",
];

/**
 * 默认轮播数据（使用 CDN 图片）
 */
/**
 * 标题数据
 */
const titles = [
  { title: "深地弧光", subtitle: "Deep Earth Arc" },
  { title: "绿能「链」动", subtitle: "Green Energy Chain" },
  { title: "弧光纪实", subtitle: "Arc Light Documentary" },
  { title: "深地见闻", subtitle: "Underground Insights" },
  { title: "点亮日志", subtitle: "Lighting Logs" },
  { title: "科技创新", subtitle: "Technology Innovation" },
  { title: "绿色发展", subtitle: "Green Development" },
  { title: "匠心筑梦", subtitle: "Craftsmanship Dreams" },
  { title: "共创未来", subtitle: "Building Future Together" },
];

export const defaultSlides: SlideItem[] = imageFiles.map((filename, index) => ({
  image: getCdnImageUrl(filename),
  title: titles[index]?.title || "默认标题",
  subtitle: titles[index]?.subtitle || "Default Subtitle",
}));
