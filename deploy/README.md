# Aristo 东南亚美妆电商平台

## 一键部署

### 方式一：使用一键部署脚本（推荐）

```bash
# 1. 上传整个 deploy 目录到服务器 /www/wwwroot/aristo

# 2. 上传项目压缩包并解压
cd /www/wwwroot
tar -xzvf aristo-deploy.tar.gz

# 3. 运行一键部署脚本
chmod +x install.sh
./install.sh
```

### 方式二：手动部署

```bash
# 1. 解压文件
tar -xzvf aristo-deploy.tar.gz
cd deploy

# 2. 安装依赖
npm install

# 3. 创建环境变量文件
cat > .env << 'EOF'
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key
COZE_BUCKET_ENDPOINT_URL=https://your-s3-endpoint
COZE_BUCKET_NAME=your-bucket-name
COZE_PROJECT_ENV=PROD
PORT=5000
EOF

# 4. 启动服务
pm2 start start.sh --name aristo
pm2 save
pm2 startup
```

## 配置说明

编辑 `.env` 文件，填入以下配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| COZE_SUPABASE_URL | Supabase 项目地址 | https://xxx.supabase.co |
| COZE_SUPABASE_ANON_KEY | Supabase 匿名密钥 | eyJhbGciOiJIUzI1NiIs... |
| COZE_BUCKET_ENDPOINT_URL | S3 存储 Endpoint | https://s3.amazonaws.com |
| COZE_BUCKET_NAME | S3 存储桶名称 | aristo-uploads |

## 宝塔反向代理配置

1. 宝塔面板 → 网站 → 添加站点
2. 设置 → 反向代理 → 添加反向代理
   - 目标URL: `http://127.0.0.1:5000`
   - 发送域名: `$host`

## 常用命令

```bash
pm2 status           # 查看状态
pm2 logs aristo      # 查看日志
pm2 restart aristo   # 重启服务
pm2 stop aristo      # 停止服务
pm2 delete aristo    # 删除服务
```

## 功能特性

- 🌏 自动根据IP切换语言（中文/泰语/越南语/印尼语/马来语/英语）
- 💱 多货币支持（USD/THB/VND/IDR/MYR）
- 📦 完整后台管理系统
- 🤖 AI在线客服
- 📱 响应式设计（PC + 移动端）

## 目录结构

```
aristo/
├── .next/           # Next.js 构建文件
├── node_modules/    # Node.js 依赖
├── server.js       # 服务器启动脚本
├── package.json    # 项目配置
├── start.sh        # 启动脚本
├── install.sh      # 一键部署脚本
├── .env           # 环境变量（需手动创建）
└── README.md      # 本文件
```
