# MD Master - Markdown 闯关小游戏

一个帮助用户学习 Markdown 和 Quarto Markdown (QMD) 语法的网页闯关小游戏，采用渐进式难度设计，支持 GitHub 账号登录和积分排行榜。

## 技术栈

### 前端

- React 18 + TypeScript
- Vite (构建工具)
- React Router v6 (路由)
- Zustand (状态管理)
- Tailwind CSS + Headless UI (UI组件)
- Monaco Editor (代码编辑)
- react-markdown + remark-gfm (Markdown渲染)

### 后端

- Node.js + Express.js
- SQLite (数据库)
- Prisma (ORM)
- Passport.js (GitHub OAuth认证)
- express-session + connect-sqlite3 (Session管理)

## 功能特性

- 20 个精心设计的关卡，涵盖 Markdown 基础和 Quarto Markdown 进阶
- 实时代码编辑与 Markdown 预览
- GitHub OAuth 登录
- 积分排行榜系统
- 个人进度追踪
- 响应式设计

## 关卡结构

| 阶段 | 名称 | 关卡范围 | 内容 |
|------|------|----------|------|
| 1 | Markdown 基础 | 1-8 | 标题、段落、粗体斜体、列表、链接、图片、引用、代码块 |
| 2 | Markdown 进阶 | 9-12 | 分隔线、表格、任务列表、脚注 |
| 3 | QMD 入门 | 13-16 | YAML元数据、代码单元格、单元格选项、图表输出 |
| 4 | QMD 进阶 | 17-20 | 交叉引用、参考文献、标注框、综合挑战 |

## 快速开始

### 1. 安装依赖

```bash
npm run install:all
```

### 2. 配置环境变量

#### 后端配置

复制 `server/.env.example` 到 `server/.env` 并配置：

```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件：

- `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`: 从 GitHub OAuth App 获取
- `GITHUB_CALLBACK_URL`: 如 `http://localhost:3001/api/auth/github/callback`
- `SESSION_SECRET`: 设置一个随机字符串作为 session 密钥
- `CLIENT_URL`: 前端地址（例如 `http://localhost:3000` 或线上域名）
- `COOKIE_SAME_SITE`: 同域用 `lax`，跨域前后端（例如前端 vercel + `api.bio-spring.top`）请设置 `none`

创建 GitHub OAuth App:

1. 访问 GitHub Settings → Developer settings → OAuth Apps
2. 点击 "New OAuth App"
3. 填写应用信息:
   - Application name: MD Master
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3001/api/auth/github/callback
4. 创建后获取 Client ID 和 Client Secret


### 2.1 前端连接到你的 API 服务器

在 `client/.env` 中配置：

```bash
VITE_API_BASE_URL=https://api.bio-spring.top/api
```

前端会把用户登录态与关卡进度都写入你配置的后端（Cookie + `/api/progress/*`）。

### 3. 初始化数据库

```bash
npm run db:setup
```

这会：

- 生成 Prisma 客户端
- 运行数据库迁移
- 导入 20 个关卡数据

### 4. 启动开发服务器

```bash
npm run dev
```

这将同时启动：

- 前端开发服务器 (http://localhost:3000)
- 后端 API 服务器 (http://localhost:3001)

### 5. 访问应用

打开浏览器访问 http://localhost:3000

## 项目结构

```
md-master/
├── client/                    # 前端项目
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── pages/             # 页面组件
│   │   ├── stores/            # Zustand 状态管理
│   │   ├── api/               # API 客户端
│   │   ├── types/             # TypeScript 类型定义
│   │   └── App.tsx            # 应用入口
│   └── package.json
├── server/                    # 后端项目
│   ├── src/
│   │   ├── routes/            # API 路由
│   │   ├── prisma/            # Prisma 配置和种子数据
│   │   └── index.ts           # 服务器入口
│   ├── prisma/
│   │   └── schema.prisma      # 数据库模型
│   └── package.json
└── README.md
```

## 可用脚本

### 根目录

- `npm run dev` - 同时启动前后端开发服务器
- `npm run build` - 构建前端生产版本
- `npm run install:all` - 安装所有依赖
- `npm run db:setup` - 初始化数据库并导入数据
- `npm run db:reset` - 重置数据库

### 服务端 (server/)

- `npm run dev` - 启动开发服务器 (带热重载)
- `npm run build` - 编译 TypeScript
- `npm run start` - 启动生产服务器
- `npm run db:migrate` - 运行数据库迁移
- `npm run db:seed` - 导入关卡数据
- `npm run db:studio` - 打开 Prisma Studio

### 客户端 (client/)

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 部署

### 前端部署 (Vercel/Netlify)

1. 构建前端：`cd client && npm run build`
2. 将 `dist` 目录部署到 Vercel 或 Netlify
3. 配置环境变量 `VITE_API_URL` 指向后端服务

### 后端部署 (Railway/Render)

1. 设置环境变量:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `CLIENT_URL` (前端部署地址)
2. 构建命令：`npm run build`
3. 启动命令：`npm run start`

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
