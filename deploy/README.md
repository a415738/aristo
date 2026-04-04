# Aristo 东南亚美妆电商平台 - 宝塔部署指南

## 环境要求
- Node.js >= 18.x
- PM2 (Node.js 进程管理器)

## 部署步骤

### 1. 上传文件
将整个 deploy 目录上传到服务器的 `/www/wwwroot/aristo` 目录

### 2. 安装依赖
```bash
cd /www/wwwroot/aristo
npm install
```

### 3. 配置环境变量
在服务器上创建 `.env` 文件：
```bash
COZE_SUPABASE_URL=your_supabase_url
COZE_SUPABASE_ANON_KEY=your_supabase_anon_key
COZE_BUCKET_ENDPOINT_URL=your_s3_endpoint
COZE_BUCKET_NAME=your_bucket_name
COZE_PROJECT_ENV=PROD
PORT=5000
```

### 4. 使用 PM2 启动服务
```bash
pm2 start start.sh --name aristo
```

### 5. 配置宝塔反向代理（可选）
如果需要通过域名访问，在宝塔中配置反向代理：
- 目标URL: http://127.0.0.1:5000
- 域名: yourdomain.com

### 6. 常用命令
```bash
pm2 status          # 查看状态
pm2 logs aristo      # 查看日志
pm2 restart aristo  # 重启服务
pm2 stop aristo     # 停止服务
```

## 目录结构
```
aristo/
├── .next/           # Next.js 构建文件
├── node_modules/    # Node.js 依赖
├── server.js        # 服务器启动脚本
├── package.json     # 项目配置
└── start.sh         # 启动脚本
```
