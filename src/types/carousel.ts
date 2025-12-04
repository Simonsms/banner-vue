/**
 * 轮播图数据类型定义
 */

/** 单个幻灯片数据（前端使用） */
export interface SlideItem {
  /** 唯一标识（用于增量更新去重） */
  id: string;
  /** 图片地址 */
  image: string;
  /** 主标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
}

/** API 返回的文件项 */
export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  url: string | null;
  thumbnailUrl: string | null;
  path: string;
  parentPath: string;
  author: string | null;
  authorTime: string | null;
  jobTitle: string | null;
  pdesc: string | null;
  createTime: string;
  updateTime: string;
  createUserString: string | null;
  type: number;
  size: number;
  extension: string;
  contentType: string;
  screenFlag: number;
  auditStatus: number;
}

/** API 响应数据格式 */
export interface CarouselApiResponse {
  code: string;
  msg: string;
  success: boolean;
  data: FileItem[];
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
