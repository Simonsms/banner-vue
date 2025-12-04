@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   图片重命名脚本
echo ========================================
echo.

cd /d "%~dp0src\assets\images"

if not exist "微信图片_2025-12-03_205657_360.jpg" (
    echo [错误] 找不到源图片文件！
    echo 请确保在项目根目录运行此脚本。
    pause
    exit /b 1
)

echo [1/9] 重命名 banner-1.jpg...
ren "微信图片_2025-12-03_205657_360.jpg" banner-1.jpg

echo [2/9] 重命名 banner-2.jpg...
ren "微信图片_2025-12-03_205738_731.jpg" banner-2.jpg

echo [3/9] 重命名 banner-3.jpg...
ren "微信图片_2025-12-03_205744_150.jpg" banner-3.jpg

echo [4/9] 重命名 banner-4.jpg...
ren "微信图片_2025-12-03_205748_911.jpg" banner-4.jpg

echo [5/9] 重命名 banner-5.jpg...
ren "微信图片_2025-12-03_205753_782.jpg" banner-5.jpg

echo [6/9] 重命名 banner-6.jpg...
ren "微信图片_2025-12-03_205758_380.jpg" banner-6.jpg

echo [7/9] 重命名 banner-7.jpg...
ren "微信图片_2025-12-03_205803_450.jpg" banner-7.jpg

echo [8/9] 重命名 banner-8.jpg...
ren "微信图片_2025-12-03_205807_801.jpg" banner-8.jpg

echo [9/9] 重命名 banner-9.jpg...
ren "微信图片_2025-12-03_205812_250.jpg" banner-9.jpg

echo.
echo ✅ 所有图片重命名完成！
echo.
echo 当前图片列表：
dir /b banner-*.jpg

echo.
echo ========================================
echo   下一步操作：
echo ========================================
echo 1. 使用 TinyPNG (https://tinypng.com/) 压缩图片
echo 2. 创建 GitHub 仓库中的 images 目录
echo 3. 上传压缩后的图片到 GitHub
echo 4. 等待 5-10 分钟让 CDN 缓存生效
echo 5. 运行 npm run build 测试
echo.

pause
