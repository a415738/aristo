# Aristo 东南亚美妆电商平台 - 宝塔部署指南

## 环境要求
- Node.js >= 18.x
- PM2 (Node.js 进程管理器)

## 部署步骤

### 1. 上传文件
将 deploy 目录上传到服务器的 `/www/wwwroot/aristo` 目录

### 2. 安装依赖
```bash
cd /www/wwwroot/aristo
npm install
```

### 3. 配置环境变量
在 `/www/wwwroot/aristo` 目录下创建 `.env` 文件：
```bash
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key
COZE_BUCKET_ENDPOINT_URL=https://your-s3-endpoint
COZE_BUCKET_NAME=your-bucket-name
COZE_PROJECT_ENV=PROD
PORT=5000
```

### 4. 使用 PM2 启动服务
```bash
pm2 start start.sh --name aristo
pm2 save
pm2 startup
```

### 5. 配置宝塔反向代理（推荐）
在宝塔面板中创建网站，然后配置反向代理：
- 目标URL: `http://127.0.0.1:5000`
- 域名: yourdomain.com

### 6. 常用命令
```bash
pm2 status           # 查看状态
pm2 logs aristo      # 查看日志
pm2 restart aristo  # 重启服务
pm2 stop aristo     # 停止服务
pm2 delete aristo   # 删除服务
```

## 功能特性
- 自动根据IP切换语言（中文/泰语/越南语/印尼语/马来语/英语）
- 多货币支持（USD/THB/VND/IDR/MYR）
- 完整后台管理系统
- AI在线客服

## 目录结构
```
aristo/
├── .next/        # Next.js 构建文件
├── node_modules/ # Node.js 依赖
├── server.js     # 服务器启动脚本
├── package.json  # 项目配置
├── start.sh      # 启动脚本
└── .env          # 环境变量（需手动创建）
```
