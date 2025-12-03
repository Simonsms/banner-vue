/*
 * @Author       : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @Date         : 2025-12-02 22:05:56
 * @LastEditors  : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @LastEditTime : 2025-12-02 22:16:50
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
  return items
    .filter((item) => item.path) // 过滤掉没有图片的项
    .map((item) => ({
      image: `http://39.106.88.72:18000/file${item.path}`, // 拼接完整图片地址
      title: item.author || "未知",
      subtitle: item.jobTitle || "",
    }));
}
