#!/bin/bash
set -e

echo "========================================"
echo "   Aristo 美妆电商平台 一键部署"
echo "========================================"

# 检查 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用 root 用户运行: sudo ./install.sh"
    exit 1
fi

# 通用 Node.js 安装
install_nodejs() {
    if command -v node &> /dev/null; then
        echo "Node.js 已安装: $(node -v)"
        return
    fi
    
    echo "安装 Node.js..."
    
    # 尝试不同的安装方式
    if command -v yum &> /dev/null; then
        yum install -y nodejs npm
    elif command -v apt-get &> /dev/null; then
        apt-get update && apt-get install -y nodejs npm
    elif command -v apk &> /dev/null; then
        apk add --no-cache nodejs npm
    elif command -v dnf &> /dev/null; then
        dnf install -y nodejs npm
    else
        # 最后尝试 nvm 或二进制安装
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install 18
    fi
}

install_nodejs

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

# 停止旧服务
pm2 stop aristo 2>/dev/null || true
pm2 delete aristo 2>/dev/null || true

# 安装依赖
echo "安装项目依赖..."
npm install --prefer-offline

# 创建环境变量文件
if [ ! -f .env ]; then
    echo "创建环境变量文件..."
    cat > .env << 'EOF'
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key
COZE_BUCKET_ENDPOINT_URL=https://your-s3-endpoint
COZE_BUCKET_NAME=your-bucket
COZE_PROJECT_ENV=PROD
PORT=5000
EOF
    echo "请编辑 .env 填入你的配置！"
fi

# 启动服务
echo "启动服务..."
pm2 start start.sh --name aristo
pm2 save
pm2 startup 2>/dev/null || true

echo ""
echo "========================================"
echo "        部署完成！"
echo "========================================"
echo ""
echo "请编辑 .env 填入配置后执行: pm2 restart aristo"
echo ""
pm2 status
