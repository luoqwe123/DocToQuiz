# DocToQuiz - 文档转题库系统

## 项目介绍

DocToQuiz是一个基于AI的智能文档转换系统，能够将PDF文档自动转换为结构化的题库，并提供在线答题和错题管理功能。系统支持单选题、多选题等多种题型，适用于学习、考试复习等场景。

## 技术栈

### 前端
- Vue 3 + TypeScript
- Element Plus 组件库
- Vue Router 路由管理
- Vite 构建工具
- SCSS 样式处理

### 后端
- NestJS 框架
- Prisma ORM 数据库操作
- WebSocket 实时通信


## 功能特点

- **智能PDF解析**：自动提取PDF文档中的文本内容
- **AI题目生成**：利用AI技术将文本内容转换为标准题目格式
- **实时进度反馈**：通过WebSocket实时显示文档处理进度
- **在线答题系统**：支持在线答题，实时判分和结果展示
- **错题本功能**：自动收集错题，方便复习
- **响应式设计**：同时支持PC端和移动端访问

## 快速开始

### 环境要求

- Node.js 16+
- PNPM 包管理器
- 数据库（项目使用Prisma ORM，可配置多种数据库）

### 安装步骤

1. 克隆项目到本地

```bash
git clone [项目地址]
cd DocToQuiz
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

复制`.env.development`文件为`.env`，并根据实际情况修改配置。

4. 启动后端服务

```bash
pnpm dev:server
```

5. 启动前端开发服务器

```bash
pnpm dev
```

6. 访问应用

打开浏览器，访问 `http://localhost:5173`

## 项目结构

```
├── app/                  # 后端应用
│   └── server/           # NestJS服务端
│       ├── prisma/       # 数据库模型
│       └── src/          # 后端源码
│           ├── PdftoJson/# PDF处理模块
│           └── prisma/   # Prisma服务
├── src/                  # 前端源码
│   ├── api/              # API接口
│   ├── components/       # 组件
│   ├── router/           # 路由配置
│   ├── types/            # 类型定义
│   ├── utils/            # 工具函数
│   └── view/             # 页面视图
```

## 使用流程

1. 在首页上传PDF文档
2. 系统自动处理文档并转换为题库
3. 处理完成后，可以开始在线答题
4. 答题过程中，系统会自动记录错题
5. 可以通过错题本功能查看和复习错题

## 开发指南

### 添加新组件

在`src/components`目录下创建新的Vue组件。

### 添加新页面

1. 在`src/view`目录下创建新的Vue页面
2. 在`src/router/routes.ts`中添加对应路由

### 添加新API

1. 在后端`app/server/src`中添加新的控制器和服务
2. 在前端`src/api`目录下添加对应的API调用函数

## 常见问题

**Q: 如何修改题目解析的AI模型？**

A: 在`app/server/src/PdftoJson/pdfFile.processor.ts`文件中修改AI接口调用部分。

**Q: 如何自定义题目展示样式？**

A: 修改`src/components/QuestionShow.vue`组件的样式部分。

## 贡献指南

欢迎提交Issue和Pull Request来完善项目。在提交PR前，请确保代码通过了Lint检查。

```bash
pnpm lint
```

## 许可证

[ISC License](LICENSE)