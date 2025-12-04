# 🚀 快速开始 - CDN 图片部署

本指南将帮你在 **5 分钟内** 完成 CDN 图片部署。

---

## ⚡ 快速步骤

### 1️⃣ 重命名图片（1 分钟）

**运行脚本：**
```cmd
rename-images.cmd
```

这将把中文图片名改为 `banner-1.jpg` ~ `banner-9.jpg`

---

### 2️⃣ 压缩图片（2 分钟）

**在线压缩（推荐）：**
1. 访问 https://tinypng.com/
2. 拖拽 9 张图片
3. 点击下载压缩后的文件

**预期效果：**
- 原始大小：~50 MB
- 压缩后：~10-15 MB（减少 70%）

---

### 3️⃣ 上传到 GitHub（2 分钟）

#### 方式 A：在当前仓库创建 images 目录

```bash
# 在项目根目录
mkdir images

# 复制压缩后的图片
copy path\to\compressed\*.jpg images\

# 提交到 GitHub
git add images/
git commit -m "feat: 添加 CDN 图片资源"
git push origin main
```

#### 方式 B：使用 GitHub 网页上传

1. 打开你的 GitHub 仓库
2. 点击 **Add file** → **Create new file**
3. 输入路径：`images/banner-1.jpg`
4. 上传所有 9 张图片
5. 点击 **Commit changes**

---

### 4️⃣ 等待 CDN 生效（5-10 分钟）

jsDelivr 会自动缓存你的 GitHub 文件。

**测试 CDN：**

在浏览器打开：
```
https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@main/images/banner-1.jpg
```

✅ 能看到图片 = CDN 已生效
❌ 404 错误 = 等待几分钟后重试

---

### 5️⃣ 构建测试

```bash
# 开发环境预览（会显示 CDN 图片）
npm run dev

# 生产环境构建
npm run build

# 检查打包体积（应该只有 ~200 KB）
dir dist\assets
```

---

## 📊 效果对比

### 使用 CDN 前
```
dist/
  assets/
    微信图片_xxx.jpg  7.2 MB
    微信图片_xxx.jpg  10.7 MB
    微信图片_xxx.jpg  12.0 MB
    ...
  Total: ~50+ MB
```

### 使用 CDN 后
```
dist/
  assets/
    index-xxx.js      5.87 KB
    vendor-xxx.js     190.13 KB
    index-xxx.css     9.31 KB
  Total: ~210 KB  ✅ 减少 99.6%
```

---

## 🔧 配置说明

### CDN 开关

编辑 `src/config/index.ts`：

```typescript
export const cdnConfig = {
  enabled: true,  // true = 使用 CDN，false = 本地图片
  baseUrl: 'https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
};
```

### 修改 CDN URL

如果你的 GitHub 用户名或仓库名不是 `Simonsms/banner-vue`，修改：

```typescript
baseUrl: 'https://cdn.jsdelivr.net/gh/你的用户名/你的仓库@main/images',
```

### 国内加速

如果国内访问慢，切换到 gcore 镜像：

```typescript
baseUrl: 'https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
```

---

## 🐛 常见问题

### ❌ 图片显示 404

**原因：** CDN 缓存未生效或 URL 错误

**解决：**
1. 确认 GitHub 仓库中图片已上传
2. 检查文件名是否正确（`banner-1.jpg` 而不是 `Banner-1.jpg`）
3. 等待 5-10 分钟
4. 手动刷新 CDN：https://www.jsdelivr.com/tools/purge

---

### ⚠️ 国内访问很慢

**解决：** 切换到 gcore 镜像

```typescript
baseUrl: 'https://gcore.jsdelivr.net/gh/Simonsms/banner-vue@main/images',
```

---

### 🔄 更新图片后 CDN 未更新

**原因：** jsDelivr 会缓存文件 7 天

**解决方案：**

1. **修改文件名**（推荐）
   ```typescript
   const imageFiles = [
     "banner-1-v2.jpg",  // 加版本号
     // ...
   ];
   ```

2. **使用 Git Tag**
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
   然后修改 CDN URL：
   ```
   https://cdn.jsdelivr.net/gh/Simonsms/banner-vue@v1.0.1/images
   ```

---

## ✅ 验证清单

部署完成后，检查：

- [ ] 图片已重命名为 `banner-1.jpg` ~ `banner-9.jpg`
- [ ] 图片已压缩（体积减少 60% 以上）
- [ ] 图片已上传到 GitHub `images` 目录
- [ ] CDN URL 可以访问（浏览器测试）
- [ ] `npm run dev` 正常显示图片
- [ ] `npm run build` 打包体积 < 500 KB
- [ ] 部署后图片加载正常

---

## 📚 详细文档

需要更多信息？查看完整文档：

- **CDN_SETUP.md** - 完整配置指南
- **src/config/index.ts** - CDN 配置文件
- **src/data/slides.ts** - 图片数据

---

## 🎉 完成！

恭喜！你已经成功配置了 CDN 图片加速。

**预期效果：**
- ⚡ 打包体积减少 99.6%
- 🚀 首屏加载时间从 3-8 秒降至 0.5-2 秒
- 💰 节省服务器带宽
- 🌍 全球 CDN 加速

有问题？查看 `CDN_SETUP.md` 获取帮助。
