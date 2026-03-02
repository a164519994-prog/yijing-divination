# 易境 - I Ching Divination App

## 部署到 Vercel 指南

### 第一步：部署后端

1. 访问 https://vercel.com 并登录（可用GitHub账号）
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository" 或拖拽 `backend` 文件夹
4. 点击 "Deploy"
5. 部署完成后记录后端地址，例如：`https://yijing-backend-xxx.vercel.app`

### 第二步：更新前端配置

1. 打开 `-1.0-main/vercel.json`
2. 将 `https://yijing-backend.vercel.app` 替换为您的后端地址

### 第三步：部署前端

1. 在 Vercel 中创建新项目
2. 上传 `-1.0-main` 文件夹
3. 点击 "Deploy"
4. 部署完成后获得前端访问地址

## 本地开发

```bash
# 启动后端
cd backend
node server.js

# 启动前端（另一个终端）
cd -1.0-main
npm install
npm run dev
```

## 项目结构

```
├── backend/           # 后端服务
│   ├── server.js      # 主服务文件
│   ├── vercel.json    # Vercel配置
│   └── package.json
├── -1.0-main/         # 前端项目
│   ├── pages/         # 页面组件
│   ├── components/    # 公共组件
│   ├── vercel.json    # Vercel配置
│   └── package.json
```
