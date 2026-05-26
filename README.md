# tishiciyouhua

AI 提示词优化工具 -- 基于 CO-STAR 框架的智能提示词优化 SaaS。

## 功能

- 多模型支持：Claude Sonnet/Opus/Haiku、GPT-4o、Gemini Pro
- CO-STAR 优化框架 + 7 种优化风格
- SSE 流式输出，实时查看优化过程
- 提示词模板库 + 安全防护（注入检测、有害内容过滤）
- 用户认证 + 订阅管理（Stripe 集成）
- 优化历史 + 用量统计

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v3 + shadcn/ui |
| 后端 | Supabase (Auth, Database, RLS) |
| AI | Anthropic API (多模型) |
| 支付 | Stripe |
| 测试 | Vitest |
| 部署 | Vercel |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/121212165/tishiciyouhua.git
cd tishiciyouhua

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入真实密钥

# 数据库迁移
supabase link --project-ref <ref>
supabase db push

# 启动开发服务器
npm run dev
```

## 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint
npm run test         # 运行测试
npm run test:watch   # 测试监听模式
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 登录/注册
│   ├── dashboard/          # 仪表盘（总览、优化、历史、设置）
│   ├── api/                # API 路由
│   └── actions/            # Server Actions
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── optimize/           # 优化相关组件
│   └── subscription/       # 订阅相关组件
├── hooks/                  # 自定义 hooks
├── lib/
│   ├── ai/                 # AI 优化逻辑
│   └── supabase/           # Supabase 客户端
└── types/                  # TypeScript 类型
supabase/
└── migrations/             # 数据库迁移
```

## 部署

参见 [DEPLOY.md](./DEPLOY.md)

## 许可证

MIT
