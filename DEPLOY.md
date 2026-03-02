# 部署指南

## Netlify 部署

### 方式一：拖拽部署（最简单）

1. **本地构建**：
   ```bash
   cd -1.0-main
   npm install
   npm run build
   ```

2. **上传dist文件夹**：
   - 打开 https://app.netlify.com/drop
   - 将 `dist` 文件夹拖进去

### 方式二：GitHub连接部署

1. 打开 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 连接GitHub，选择 `yijing-divination` 仓库
4. **Base directory**: `-1.0-main`
5. **Build command**: `npm run build`
6. **Publish directory**: `dist`
7. 点击 "Deploy site"

---

## 或者继续使用Vercel

在Vercel上点击 "Redeploy" 多试几次，Vercel的内部错误通常是临时的。
