# 图片资源目录

本项目已配置使用 **jsDelivr CDN** 加速图片加载。

## 📌 说明

- ✅ 图片通过 CDN 加载，不再打包到项目中
- ✅ 本地图片仅用于开发调试（已添加到 .gitignore）
- ✅ 生产环境使用 GitHub + jsDelivr 加速

## 🚀 使用步骤

请参考项目根目录的 `CDN_SETUP.md` 文件进行配置。

## 📁 目录说明

- 开发时可以在此目录放置图片进行调试
- 生产环境图片需上传到 GitHub 仓库的 `images` 目录
- CDN 配置位于：`src/config/index.ts`
