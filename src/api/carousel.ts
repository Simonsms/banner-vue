/*
 * @Author       : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @Date         : 2025-12-02 22:05:56
 * @LastEditors  : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @LastEditTime : 2025-12-04 22:49:36
 * @FilePath     : \iosbanner-vue\src\api\carousel.ts
 * @Description  :
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import axios from "axios";
import type {
  CarouselApiResponse,
  SlideItem,
  FileItem,
} from "@/types/carousel";

// 创建 axios 实例
const service = axios.create({
  baseURL: "/dev-api",
  timeout: 10000,
});

/**
 * 获取轮播图数据
 */
export async function fetchCarouselData(): Promise<SlideItem[]> {
  try {
    const res = await service.get<CarouselApiResponse>("/system/file/screen");

    if (res.data.code === "0" && res.data.data) {
      return transformFileItems(res.data.data);
    }
  } catch (error) {
    console.error("获取轮播数据失败:", error);
  }

  return [];
}

/**
 * 将 API 返回的 FileItem 转换为前端使用的 SlideItem
 */
function transformFileItems(items: FileItem[]): SlideItem[] {
  // 从环境变量获取 OSS 图片域名
  const ossUrl = import.meta.env.VITE_APP_OSS_URL || "";

  return items
    .filter((item) => item.path) // 过滤掉没有图片的项
    .map((item) => {
      // 对路径进行 URL 编码（处理中文等特殊字符）
      const encodedPath = item.path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

      return {
        id: item.id, // 保留唯一标识，用于增量更新去重
        image: `${ossUrl}${encodedPath}`,
        title: item.author || "未知",
        subtitle: item.jobTitle || "",
      };
    });
}

/**
 * 增量同步结果
 */
export interface CarouselSyncResult {
  /** 新增的轮播项 */
  addedItems: SlideItem[];
  /** 需要删除的轮播项ID */
  removedIds: string[];
}

/**
 * 增量同步轮播图数据（返回新增和删除的项）
 * @param existingIds 已存在的图片ID集合
 */
export async function syncCarouselItems(
  existingIds: Set<string>
): Promise<CarouselSyncResult> {
  const result: CarouselSyncResult = {
    addedItems: [],
    removedIds: [],
  };

  try {
    const res = await service.get<CarouselApiResponse>("/system/file/screen");

    if (res.data.code === "0" && res.data.data) {
      // 服务端当前所有ID
      const serverIds = new Set(res.data.data.map((item) => item.id));

      // 1. 找出新增的数据（服务端有，本地没有）
      const newItems = res.data.data.filter(
        (item) => !existingIds.has(item.id)
      );
      if (newItems.length > 0) {
        console.log(`[轮播增量同步] 发现 ${newItems.length} 条新增数据`);
        result.addedItems = transformFileItems(newItems);
      }

      // 2. 找出删除的数据（本地有，服务端没有）
      existingIds.forEach((id) => {
        if (!serverIds.has(id)) {
          result.removedIds.push(id);
        }
      });
      if (result.removedIds.length > 0) {
        console.log(
          `[轮播增量同步] 发现 ${result.removedIds.length} 条已删除数据`
        );
      }
    }
  } catch (error) {
    console.error("增量同步轮播数据失败:", error);
  }

  return result;
}

/**
 * @deprecated 请使用 syncCarouselItems 代替
 * 增量获取轮播图数据（只返回新增的项）
 * @param existingIds 已存在的图片ID集合
 */
export async function fetchNewCarouselItems(
  existingIds: Set<string>
): Promise<SlideItem[]> {
  const result = await syncCarouselItems(existingIds);
  return result.addedItems;
}
