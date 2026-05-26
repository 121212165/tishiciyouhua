# 部署指南

## Vercel 部署

### 前置条件
1. Vercel 账号 + 关联 GitHub 仓库
2. Supabase 项目已创建

### 环境变量
在 Vercel Dashboard -> Settings -> Environment Variables 设置：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NEXT_PUBLIC_APP_URL` | 生产域名 (如 https://tishiciyouhua.vercel.app) |
| `STRIPE_SECRET_KEY` | Stripe 密钥 |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Pro 月付价格 ID |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Pro 年付价格 ID |

### 数据库迁移
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### 部署
Push 到 `main` 分支自动部署，或手动：
```bash
vercel --prod
```

### GitHub Actions
设置以下 Secrets：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Stripe Webhook
在 Stripe Dashboard 设置 webhook endpoint:
`https://your-domain.vercel.app/api/webhooks/stripe`

监听事件：
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
