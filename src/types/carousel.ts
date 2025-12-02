/**
 * 轮播图数据类型定义
 * 为后续接口对接做准备
 */

/** 单个幻灯片数据 */
export interface SlideItem {
  /** 图片地址 */
  image: string;
  /** 姓名 */
  name: string;
  /** 职务 */
  position: string;
  /** 感悟 */
  thoughts: string;
}

/** API 响应数据格式（预留接口对接） */
export interface CarouselApiResponse {
  code: number;
  message: string;
  data: SlideItem[];
}

/** 轮播配置选项 */
export interface CarouselOptions {
  /** 自动播放间隔（毫秒） */
  autoPlayInterval?: number;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 是否显示首屏动画 */
  showIntroAnimation?: boolean;
}
