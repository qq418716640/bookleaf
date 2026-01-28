# Bookleaf 部署指南

## 环境说明

本项目支持多环境部署:

- **开发环境**: 本地开发,baseURL 为 `/`
- **预览环境**: Vercel 部署,baseURL 为 `/`
- **生产环境**: 自有服务器 Spring Boot 部署,baseURL 为 `/bookleaf/`

## 环境变量配置

### 1. 创建环境变量文件

复制示例文件:

```bash
cp .env.example .env
```

### 2. 配置环境变量

编辑 `.env` 文件,根据部署环境设置相应的值:

#### 开发/预览环境

```env
# Umami Analytics (开发/预览环境)
NUXT_PUBLIC_UMAMI_HOST=https://umami-rose-delta.vercel.app
NUXT_PUBLIC_UMAMI_ID=a56d992c-093a-4c58-aaae-59cf5d2cdc0d

# Google Tag Manager (不设置,仅生产环境使用)
# NUXT_PUBLIC_GTM_ID=

# Base URL (不设置,默认为 /)
# NUXT_APP_BASE_URL=/
```

#### 生产环境

```env
# Umami Analytics (生产环境)
NUXT_PUBLIC_UMAMI_HOST=https://umami-rose-delta.vercel.app
NUXT_PUBLIC_UMAMI_ID=96586b14-00ab-43d1-8c31-3212d9f9beee

# Google Tag Manager (生产环境)
NUXT_PUBLIC_GTM_ID=TM-WMJSMTWF

# Base URL (自有服务器部署)
NUXT_APP_BASE_URL=/bookleaf/
```

## 部署步骤

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:4000)
npm run dev
```

### 预览环境 (Vercel)

Vercel 会自动检测 `vercel.json` 配置并执行构建:

```bash
# Vercel 自动执行
npm run generate
```

输出目录: `.output/public/`

### 生产环境 (自有服务器 - Spring Boot)

#### 方式一: 使用专用命令 (推荐)

```bash
# 1. 安装依赖
npm install

# 2. 生产环境打包
npm run generate:prod
```

#### 方式二: 手动设置环境变量

```bash
# 1. 安装依赖
npm install

# 2. 设置环境变量并打包
NUXT_APP_BASE_URL=/bookleaf/ npm run generate
```

#### 3. 验证打包结果

```bash
# 查看输出目录
ls -la .output/public/

# 本地预览 (可选)
npm run preview
```

#### 4. 部署到服务器

将 `.output/public/` 目录下的所有文件上传到服务器的 `/bookleaf/` 路径:

```bash
# 示例: 使用 rsync 部署
rsync -avz .output/public/ user@server:/path/to/spring-boot/static/bookleaf/

# 或者使用 scp
scp -r .output/public/* user@server:/path/to/spring-boot/static/bookleaf/
```

## 环境特性说明

### Google Tag Manager (GTM)

- **开发环境**: 不加载 GTM
- **预览环境**: 不加载 GTM
- **生产环境**: 自动加载 GTM (ID: `TM-WMJSMTWF`)
  - 仅当 `baseURL` 为 `/bookleaf/` 时才会注入 GTM 脚本
  - 位置: `app/plugins/gtm.client.ts`

### Umami Analytics

- **开发/预览**: 使用测试 Website ID (`a56d992c-093a-4c58-aaae-59cf5d2cdc0d`)
- **生产环境**: 使用生产 Website ID (`96586b14-00ab-43d1-8c31-3212d9f9beee`)

### 静态资源路径

项目会根据 `NUXT_APP_BASE_URL` 自动处理所有资源路径:

- 开发/预览: `/images/logo.svg`
- 生产环境: `/bookleaf/images/logo.svg`

## 构建输出

```
.output/
└── public/              # 静态文件输出目录
    ├── _nuxt/          # JS/CSS 等资源
    ├── images/         # 图片资源
    ├── fonts/          # 字体文件
    ├── index.html      # 主页面
    ├── robots.txt      # SEO
    └── sitemap.xml     # 站点地图
```

## 常见问题

### 1. 资源 404 错误

**问题**: 部署后图片/字体等资源 404

**解决**: 确保设置了正确的 `NUXT_APP_BASE_URL`:
- 生产环境必须设置为 `/bookleaf/`
- 使用 `npm run generate:prod` 命令

### 2. GTM 未加载

**问题**: 生产环境 GTM 没有加载

**检查**:
1. 确认 `NUXT_PUBLIC_GTM_ID` 已设置为 `TM-WMJSMTWF`
2. 确认 `baseURL` 为 `/bookleaf/` (检查浏览器开发者工具 Network)
3. 查看 `app/plugins/gtm.client.ts` 日志

### 3. Umami 数据未记录

**问题**: Analytics 数据未上报

**检查**:
1. 确认环境变量 `NUXT_PUBLIC_UMAMI_HOST` 和 `NUXT_PUBLIC_UMAMI_ID` 已设置
2. 检查浏览器控制台是否有错误
3. 确认使用了正确的 Website ID (开发/生产)

## 版本控制

- `.env` 文件已在 `.gitignore` 中,不会被提交
- `.env.example` 作为模板提交到仓库
- 每个环境需要单独配置 `.env` 文件

## 相关文件

- `package.json` - NPM 脚本配置
- `nuxt.config.ts` - Nuxt 配置
- `vercel.json` - Vercel 部署配置
- `.env.example` - 环境变量模板
- `app/plugins/gtm.client.ts` - GTM 插件
- `app/plugins/umami.client.ts` - Umami 插件

## 技术栈

- **框架**: Nuxt 3 (SSG 模式)
- **渲染**: 静态站点生成 (Static Site Generation)
- **部署**: Vercel (预览) / Spring Boot (生产)
- **分析**: Umami + Google Tag Manager

---

最后更新: 2026-01-28
