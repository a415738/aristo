#!/bin/bash
set -e

# =============================================
# Aristo 美妆电商平台 - 一键部署脚本
# =============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Aristo 美妆电商平台 一键部署${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户运行: sudo ./install.sh${NC}"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}安装 Node.js 18...${NC}"
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi
echo -e "${GREEN}Node.js: $(node -v)${NC}"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}安装 PM2...${NC}"
    npm install -g pm2
fi

# 停止旧服务
if pm2 list | grep -q aristo; then
    echo -e "${YELLOW}停止旧服务...${NC}"
    pm2 stop aristo 2>/dev/null || true
    pm2 delete aristo 2>/dev/null || true
fi

# 安装依赖
echo -e "${YELLOW}安装依赖...${NC}"
npm install --prefer-offline

# 创建环境变量文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}创建环境变量文件...${NC}"
    cat > .env << 'EOF'
# Supabase 配置
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key

# S3 存储配置
COZE_BUCKET_ENDPOINT_URL=https://your-s3-endpoint
COZE_BUCKET_NAME=your-bucket

# 运行配置
COZE_PROJECT_ENV=PROD
PORT=5000
NODE_ENV=production
EOF
    echo -e "${RED}请编辑 .env 填入你的配置！${NC}"
fi

# 启动服务
echo -e "${YELLOW}启动服务...${NC}"
pm2 start start.sh --name aristo
pm2 save

# 开机自启
pm2 startup 2>/dev/null || true

# 显示状态
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}        部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "访问地址: http://你的服务器IP:5000"
echo ""
echo -e "${YELLOW}请编辑 .env 填入配置后执行: pm2 restart aristo${NC}"
echo ""
pm2 status
