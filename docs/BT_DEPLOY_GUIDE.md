# Aristo 东南亚美妆电商平台 - 宝塔面板部署指南

## 环境要求

- **操作系统**: CentOS 7+ / Ubuntu 20.04+ / Debian 11+
- **Node.js**: 18.x 或更高版本 (推荐 20.x LTS)
- **Nginx**: 1.18+
- **PM2**: 最新版本
- **内存**: 最少 2GB RAM

## 部署步骤

### 第一步：安装 Node.js

在宝塔面板的 **软件商店** 中搜索安装：
- **Node.js 版本管理器** (可选，方便管理多版本 Node.js)

或者通过 SSH 执行：

```bash
# 安装 Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 或 Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 第二步：安装 PM2

```bash
npm install -g pm2
```

### 第三步：上传项目文件

1. 在宝塔面板中创建网站目录：`/www/wwwroot/aristo`
2. 通过 SFTP 或宝塔文件管理器上传项目文件
3. 或使用 Git 克隆：

```bash
cd /www/wwwroot/aristo
git clone https://your-repo-url.git .
```

### 第四步：安装依赖

```bash
cd /www/wwwroot/aristo
npm install -g pnpm
pnpm install
```

### 第五步：配置环境变量

创建 `.env.local` 文件：

```bash
cd /www/wwwroot/aristo
nano .env.local
```

添加以下配置（根据实际情况修改）：

```env
# 数据库配置 (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# S3 对象存储
S3_ENDPOINT=https://your-s3-endpoint
S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=aristo-uploads

# 网站配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Aristo Beauty
```

### 第六步：构建项目

```bash
cd /www/wwwroot/aristo
pnpm build
```

### 第七步：配置 PM2

创建 PM2 配置文件：

```bash
cd /www/wwwroot/aristo
pm2 init simple
```

编辑 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'aristo',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/www/wwwroot/aristo',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

启动应用：

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 第八步：配置 Nginx 反向代理

在宝塔面板中：

1. **网站** → **添加站点**
2. 填写域名（如 `aristo.com`）
3. PHP 版本选择 **纯静态**
4. 创建后，进入网站设置 → **反向代理** → **添加反向代理**

```
代理名称: aristo
目标URL: http://127.0.0.1:3000
发送域名: $host
```

或者手动配置 Nginx，参考 `scripts/nginx-aristo.conf`

### 第九步：配置 SSL 证书

在宝塔面板中：

1. 进入网站设置 → **SSL** → **Let's Encrypt**
2. 选择域名，申请免费证书
3. 开启强制 HTTPS

## 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs aristo

# 重启应用
pm2 restart aristo

# 停止应用
pm2 stop aristo

# 查看实时日志
pm2 logs aristo --f

# 监控资源使用
pm2 monit
```

## 目录结构

```
/www/wwwroot/aristo/
├── .next/              # Next.js 构建文件
├── dist/               # 服务端构建文件
├── node_modules/        # 依赖
├── public/             # 静态资源
├── src/                # 源代码
├── .env.local          # 环境变量 (需创建)
├── ecosystem.config.js # PM2 配置
├── package.json
└── next.config.ts
```

## 故障排查

### 1. 端口被占用

```bash
# 查看 3000 端口占用
lsof -i:3000

# 或
netstat -tlnp | grep 3000

# 杀死占用进程
kill -9 <PID>
```

### 2. 数据库连接失败

- 检查 `.env.local` 中的 Supabase 配置
- 确保数据库 URL 可访问
- 检查防火墙设置

### 3. 图片上传失败

- 检查 S3 配置是否正确
- 确保存储桶权限设置正确
- 检查存储桶 CORS 配置

### 4. 应用启动失败

```bash
# 查看详细错误日志
pm2 logs aristo --err --lines 100

# 检查 Node 版本
node -v

# 重新安装依赖
rm -rf node_modules
pnpm install
```

## 性能优化建议

### 1. 使用 PM2 集群模式

在 `ecosystem.config.js` 中：

```javascript
instances: 'max',  // 使用所有 CPU 核心
exec_mode: 'cluster',
```

### 2. 启用 Nginx 缓存

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    proxy_pass http://127.0.0.1:3000;
    expires 7d;
    add_header Cache-Control "public, immutable";
}
```

### 3. 配置 CDN

建议使用云服务商 CDN 加速静态资源：
- 阿里云 CDN
- 腾讯云 CDN
- Cloudflare

## 更新部署

```bash
cd /www/wwwroot/aristo

# 拉取最新代码
git pull

# 重新安装依赖
pnpm install

# 重新构建
pnpm build

# 重启应用
pm2 restart aristo
```

## 备份

### 数据库备份 (Supabase)

在 Supabase Dashboard 中手动备份，或设置自动备份。

### 文件备份

```bash
# 备份整个项目
tar -czvf aristo-backup-$(date +%Y%m%d).tar.gz /www/wwwroot/aristo

# 备份环境变量
cp /www/wwwroot/aristo/.env.local /path/to/backup/
```

## 监控

### PM2 Plus (可选)

```bash
pm2 link <key> <id>  # 关联 PM2 Plus 账户
```

### 日志管理

```bash
# 配置日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

如有问题，请检查：
1. `/www/wwwlogs/` 下的 Nginx 日志
2. `pm2 logs aristo` 应用日志
3. 宝塔面板安全设置中的端口放行
