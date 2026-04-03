# ===========================================
# Aristo 东南亚美妆电商平台
# 宝塔面板一键部署脚本
# ===========================================

#!/bin/bash
set -e

echo "==========================================="
echo "Aristo 部署脚本"
echo "==========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目名称
PROJECT_NAME="aristo"
PROJECT_DIR="/www/wwwroot/aristo"

# 检测是否在宝塔环境
if [ ! -d "/www/server" ]; then
    echo -e "${YELLOW}警告: 未检测到宝塔面板环境，将使用标准方式部署${NC}"
fi

# 创建项目目录
echo -e "${GREEN}[1/6] 创建项目目录...${NC}"
mkdir -p $PROJECT_DIR

# 复制项目文件
echo -e "${GREEN}[2/6] 复制项目文件...${NC}"
# 在实际部署时，这里应该从 git 或压缩包复制文件
# cp -r /path/to/source/* $PROJECT_DIR/

# 安装 Node.js 依赖
echo -e "${GREEN}[3/6] 安装依赖...${NC}"
cd $PROJECT_DIR
pnpm install --prefer-frozen-lockfile

# 构建项目
echo -e "${GREEN}[4/6] 构建项目...${NC}"
pnpm build

# 配置 PM2
echo -e "${GREEN}[5/6] 配置 PM2 进程管理器...${NC}"
pm2 delete $PROJECT_NAME 2>/dev/null || true
pm2 start npm --name "$PROJECT_NAME" -- start

# 保存 PM2 配置
pm2 save
pm2 startup

echo -e "${GREEN}[6/6] 配置完成！${NC}"
echo ""
echo "==========================================="
echo -e "${GREEN}部署成功！${NC}"
echo "==========================================="
echo ""
echo "项目路径: $PROJECT_DIR"
echo "启动命令: pm2 start aristo"
echo "日志查看: pm2 logs $PROJECT_NAME"
echo "状态查看: pm2 status"
echo ""
echo "访问地址: http://your-server-ip:3000"
echo ""
echo "请确保已配置:"
echo "1. Nginx 反向代理 (端口 3000 -> 80/443)"
echo "2. 环境变量文件 .env.local"
echo "3. 数据库连接"
echo "4. S3 存储配置"
echo ""
