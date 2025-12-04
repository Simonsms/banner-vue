# 📦 jsDelivr + GitHub CDN 部署指南

本项目已配置使用 **jsDelivr** 免费 CDN 加速图片加载。

---

## 📋 前置准备

### 1. 压缩图片（强烈推荐）

**上传前必须先压缩！** 原图总大小约 50MB，压缩后可减少 70-90%。

#### 方式 A：在线工具（推荐）

1. **TinyPNG**（最简单）
   - 访问：https://tinypng.com/
   - 拖拽图片，自动压缩
   - 下载压缩后的文件

2. **Squoosh**（Google 出品）
   - 访问：https://squoosh.app/
   - 支持批量处理
   - 可选择 WebP 格式（体积更小）

#### 方式 B：本地命令行工具

```bash
# 安装 sharp-cli
npm install -g sharp-cli

# 批量压缩为 JPEG（80% 质量）
cd src/assets/images
sharp -i "*.jpg" -o "../../../cdn-images" --quality 80

# 或转换为 WebP（75% 质量，推荐）
sharp -i "*.jpg" -o "../../../cdn-images" --format webp --quality 75
```

---

## 🚀 部署步骤

### 步骤 1：重命名图片文件

将 `src/assets/images` 目录下的图片重命名为简短的英文名：

```
微信图片_2025-12-03_205657_360.jpg → banner-1.jpg
微信图片_2025-12-03_205738_731.jpg → banner-2.jpg
微信图片_2025-12-03_205744_150.jpg → banner-3.jpg
微信图片_2025-12-03_205748_911.jpg → banner-4.jpg
微信图片_2025-12-03_205753_782.jpg → banner-5.jpg
微信图片_2025-12-03_205758_380.jpg → banner-6.jpg
微信图片_2025-12-03_205803_450.jpg → banner-7.jpg
微信图片_2025-12-03_205807_801.jpg → banner-8.jpg
微信图片_2025-12-03_205812_250.jpg → banner-9.jpg
```

**一键重命名脚本（Windows CMD）：**

```cmd
cd src\assets\images
ren "微信图片_2025-12-03_205657_360.jpg" banner-1.jpg
ren "微信图片_2025-12-03_205738_731.jpg" banner-2.jpg
ren "微信图片_2025-12-03_205744_150.jpg" banner-3.jpg
ren "微信图片_2025-12-03_205748_911.jpg" banner-4.jpg
ren "微信图片_2025-12-03_205753_782.jpg" banner-5.jpg
ren "微信图片_2025-12-03_205758_380.jpg" banner-6.jpg
ren "微信图片_2025-12-03_205803_450.jpg" banner-7.jpg
ren "微信图片_2025-12-03_205807_801.jpg" banner-8.jpg
ren "微信图片_2025-12-03_205812_250.jpg" banner-9.jpg
```

---

### 步骤 2：创建 GitHub 图片仓库

#### 选项 A：在当前仓库创建 images 目录（推荐）

```bash
# 在项目根目录创建 images 目录
mkdir images

# 复制压缩后的图片
copy src\assets\images\banner-*.jpg images\

# 提交到 GitHub
git add images/
git commit -m "chore: 添加 CDN 图片资源"
git push origin main
```

#### 选项 B：创建独立的图片仓库

1. 在 GitHub 创建新仓库：`banner-images`
2. 上传图片到仓库根目录
3. 修改 `src/config/index.ts` 中的 CDN URL：

```typescript
baseUrl: 'https://cdn.jsdelivr.net/gh/Simonsms/banner-images@main',
```

---

### 步骤 3：等待 CDN 生效

jsDelivr 会自动缓存 GitHub 文件，通常 **5-10 分钟** 生效。

**测试 CDN 是否可用：**

访问浏览器测试：
```
https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@main/images/banner-1.jpg
```

如果能看到图片，说明 CDN 已生效！

---

### 步骤 4：更新代码配置

**无需修改代码！** 我已经配置好了：

- ✅ `src/config/index.ts` - CDN 配置
- ✅ `src/data/slides.ts` - 使用 CDN 图片链接
- ✅ `vite.config.ts` - 排除图片资源打包

---

### 步骤 5：构建测试

```bash
# 开发环境测试
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

---

## 🔧 配置说明

### CDN 开关

在 `src/config/index.ts` 中控制 CDN：

```typescript
export const cdnConfig = {
  enabled: true,  // true = 使用 CDN，false = 使用本地图片
  baseUrl: 'https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
  // 备用 CDN（国内访问更快）
  fallbackUrls: [
    'https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
    'https://fastly.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
  ],
};
```

### 修改 CDN URL

如果你使用的是不同的 GitHub 用户名或仓库名，修改以下配置：

```typescript
// 格式：https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/目录
baseUrl: 'https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/images',
```

---

## 🌐 jsDelivr 镜像站点

### 国际访问

- **主站**：`cdn.jsdelivr.net`（推荐，全球 CDN）
- **Fastly**：`fastly.jsdelivr.net`（美国节点）

### 国内访问

- **gcore**：`gcore.jsdelivr.net`（国内访问友好）
- **直连 GitHub**：`raw.githubusercontent.com/Simonsms/banner-vue/main/images/banner-1.jpg`

**国内用户建议使用 gcore 镜像：**

```typescript
baseUrl: 'https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
```

---

## 📊 性能对比

### 使用 CDN 前（本地打包）

- 打包体积：~50+ MB
- 首屏加载：3-8 秒
- 服务器带宽压力：大

### 使用 CDN 后

- 打包体积：~200 KB（减少 99%）
- 首屏加载：0.5-2 秒
- 服务器带宽压力：几乎为零
- CDN 全球加速：边缘节点就近访问

---

## 🐛 常见问题

### Q1：图片显示 404

**原因：** CDN 缓存未生效或 URL 错误

**解决：**
1. 确认 GitHub 仓库中图片已上传
2. 检查文件名是否正确（区分大小写）
3. 等待 5-10 分钟让 CDN 缓存
4. 手动刷新 CDN 缓存：https://www.jsdelivr.com/tools/purge

---

### Q2：国内访问很慢

**解决：** 切换到 gcore 镜像

```typescript
baseUrl: 'https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
```

---

### Q3：想临时使用本地图片

**解决：** 关闭 CDN

```typescript
export const cdnConfig = {
  enabled: false,  // 关闭 CDN
  // ...
};
```

---

### Q4：更新图片后 CDN 未更新

**原因：** jsDelivr 会缓存文件 7 天

**解决方案：**

1. **修改文件名**（推荐）
   ```typescript
   const imageFiles = [
     "banner-1-v2.jpg",  // 加版本号
     // ...
   ];
   ```

2. **手动清除缓存**
   - 访问：https://www.jsdelivr.com/tools/purge
   - 输入 URL 清除缓存

3. **使用 Git Tag**（自动更新）
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
   然后修改 CDN URL：
   ```
   https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@v1.0.1/images
   ```

---

## 📈 后续优化建议

### 1. 使用 WebP 格式

WebP 比 JPEG 小 30-50%，支持现代浏览器。

```bash
# 转换为 WebP
sharp -i "banner-*.jpg" -o "webp/" --format webp --quality 75
```

然后修改文件名：
```typescript
const imageFiles = [
  "banner-1.webp",
  // ...
];
```

---

### 2. 响应式图片

根据屏幕大小加载不同尺寸：

```bash
# 生成多种尺寸
sharp banner-1.jpg -o banner-1-768.jpg --resize 768
sharp banner-1.jpg -o banner-1-1920.jpg --resize 1920
```

---

### 3. 图片懒加载

在 `src/components/HeroSlider/index.vue` 中已实现预加载逻辑，可以进一步优化：

```typescript
// 首屏只加载前 2 张
onMounted(() => {
  preloadImage(slides.value[0].image);
  preloadImage(slides.value[1].image);
});
```

---

## ✅ 验证清单

部署完成后，检查以下项目：

- [ ] 图片已压缩（体积减少 60% 以上）
- [ ] 图片已重命名为英文
- [ ] 图片已上传到 GitHub
- [ ] CDN URL 可以访问
- [ ] 本地 `npm run dev` 正常显示
- [ ] 生产构建 `npm run build` 成功
- [ ] 打包体积显著减少
- [ ] 部署后图片加载正常

---

## 🔗 相关链接

- **jsDelivr 官网**：https://www.jsdelivr.com/
- **TinyPNG**：https://tinypng.com/
- **Squoosh**：https://squoosh.app/
- **GitHub Repo**：https://github.com/Simonsms/banner-vue

---

## 📞 需要帮助？

如果遇到问题，请检查：

1. GitHub 仓库是否公开
2. 图片文件名是否正确
3. CDN URL 格式是否正确
4. 等待 5-10 分钟让 CDN 缓存生效

---

**祝你部署顺利！🎉**
