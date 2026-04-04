# Aristo 东南亚美妆电商平台

## 一键部署

```bash
# 上传到 /www/wwwroot 后执行
tar -xzvf *.tar.gz
chmod +x install.sh
./install.sh
```

## 配置

编辑 `.env` 文件，填入你的 Supabase 和 S3 配置：

```bash
nano .env
```

重启服务：

```bash
pm2 restart aristo
```

## 常用命令

```bash
pm2 status        # 查看状态
pm2 logs aristo   # 查看日志
pm2 restart aristo # 重启
```
