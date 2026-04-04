#!/bin/bash
set -e

# =============================================
# Aristo 东南亚美妆电商平台 - 一键部署脚本
# =============================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="/www/wwwroot/aristo"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Aristo 美妆电商平台 一键部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户运行此脚本${NC}"
    echo -e "${YELLOW}命令: sudo bash install.sh${NC}"
    exit 1
fi

# 检查 Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}正在安装 Node.js 18...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    echo -e "${GREEN}Node.js 版本: $(node -v)${NC}"
}

# 检查 PM2
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}正在安装 PM2...${NC}"
        npm install -g pm2
    fi
    echo -e "${GREEN}PM2 已安装${NC}"
}

# 创建目录
create_dir() {
    echo -e "${YELLOW}创建项目目录...${NC}"
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    echo -e "${GREEN}目录已创建: $PROJECT_DIR${NC}"
}

# 停止旧服务
stop_old_service() {
    if pm2 list | grep -q aristo; then
        echo -e "${YELLOW}停止旧服务...${NC}"
        pm2 stop aristo 2>/dev/null || true
        pm2 delete aristo 2>/dev/null || true
    fi
}

# 安装依赖
install_deps() {
    echo -e "${YELLOW}安装项目依赖...${NC}"
    cd $PROJECT_DIR
    npm install --prefer-offline
    echo -e "${GREEN}依赖安装完成${NC}"
}

# 配置环境变量
setup_env() {
    echo -e "${YELLOW}配置环境变量...${NC}"
    
    cat > $PROJECT_DIR/.env << 'ENVEOF'
# Supabase 配置
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key-here

# S3 存储配置
COZE_BUCKET_ENDPOINT_URL=https://your-s3-endpoint
COZE_BUCKET_NAME=your-bucket-name

# 运行配置
COZE_PROJECT_ENV=PROD
PORT=5000
NODE_ENV=production
ENVEOF

    echo -e "${GREEN}环境变量文件已创建: $PROJECT_DIR/.env${NC}"
    echo -e "${YELLOW}请编辑 $PROJECT_DIR/.env 填入您的配置${NC}"
}

# 启动服务
start_service() {
    echo -e "${YELLOW}启动服务...${NC}"
    cd $PROJECT_DIR
    pm2 start start.sh --name aristo
    pm2 save
    echo -e "${GREEN}服务已启动${NC}"
}

# 配置开机自启
setup_autostart() {
    echo -e "${YELLOW}配置开机自启...${NC}"
    pm2 startup
    echo -e "${GREEN}开机自启配置完成${NC}"
}

# 显示状态
show_status() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}            部署完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "项目目录: ${YELLOW}$PROJECT_DIR${NC}"
    echo -e "访问地址: ${YELLOW}http://你的服务器IP:5000${NC}"
    echo ""
    echo -e "常用命令:"
    echo -e "  ${YELLOW}pm2 status${NC}        - 查看服务状态"
    echo -e "  ${YELLOW}pm2 logs aristo${NC}   - 查看日志"
    echo -e "  ${YELLOW}pm2 restart aristo${NC}- 重启服务"
    echo ""
    echo -e "${RED}请记得修改 .env 文件中的配置！${NC}"
    echo ""
    pm2 status
}

# 主流程
main() {
    check_node
    check_pm2
    create_dir
    stop_old_service
    install_deps
    setup_env
    start_service
    setup_autostart
    show_status
}

# 执行
main
