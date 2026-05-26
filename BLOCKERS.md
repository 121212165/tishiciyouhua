# 上线阻塞项 (Blockers)

> 更新日期: 2026-05-26
> 项目: tishiciyouhua (PromptChef)
> Supabase 项目: tishiciyouhua (ref: `showhfoxqcwpxkalczxn`, region: ap-southeast-1)

---

## 阻塞项 1: 数据库迁移无法推送

**严重度:** P0 — 上线前必须解决

**现象:**
```
$ supabase db push
failed to connect to postgres: failed to connect to
`host=db.showhfoxqcwpxkalczxn.supabase.co user=cli_login_postgres database=postgres`:
hostname resolving error (lookup db.showhfoxqcwpxkalczxn.supabase.co: no such host)
```

**项目状态:** Supabase API 显示 `ACTIVE_HEALTHY`（非暂停），但本地 DNS 无法解析数据库主机名。

**可能原因:**
1. 本地 DNS 不解析 Supabase 内部数据库域名（运营商/防火墙限制）
2. Supabase 免费版数据库仅支持通过连接池（PgBouncer）访问，需要 Session mode 连接串
3. 需要数据库密码才能通过直连方式推送

**解决方案（任选其一）:**

### 方案 A: Dashboard SQL Editor 手动执行（推荐，无需密码）

1. 打开 [Supabase SQL Editor](https://supabase.com/dashboard/project/showhfoxqcwpxkalczxn/sql)
2. 依次粘贴执行以下文件内容：
   - `supabase/migrations/00001_initial_schema.sql` — 建表 + 索引 + 触发器
   - `supabase/migrations/00002_rls_policies.sql` — RLS 策略
   - `supabase/migrations/00003_profile_trigger.sql` — 注册自动建 profile
3. 执行完成后，在 Dashboard Table Editor 确认 4 张表已创建

### 方案 B: 提供数据库密码通过 CLI 推送

1. 从 Supabase Dashboard → Settings → Database 获取密码
2. 运行:
   ```bash
   supabase db push --db-url "postgresql://postgres:<密码>@db.showhfoxqcwpxkalczxn.supabase.co:5432/postgres"
   ```

### 方案 C: 排查 DNS 问题

```bash
# 测试 DNS 解析
nslookup db.showhfoxqcwpxkalczxn.supabase.co

# 如果失败，尝试换 DNS
# Windows: 设置 DNS 为 8.8.8.8 / 1.1.1.1
# 然后重试 supabase db push
```

---

## 阻塞项 2: 环境变量未配置

**严重度:** P0 — 部署前必须配置

**需要在 Vercel Dashboard 配置的环境变量:**

| 变量 | 来源 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | service role key（保密） |
| `ANTHROPIC_API_KEY` | Anthropic Console | AI 调用密钥 |
| `NEXT_PUBLIC_APP_URL` | Vercel 分配的域名 | 如 `https://tishiciyouhua.vercel.app` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | 测试/生产密钥 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks | webhook 签名密钥 |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe Dashboard → Products | Pro 月付价格 ID |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Stripe Dashboard → Products | Pro 年付价格 ID |

**本地开发:** 在项目根目录创建 `.env.local`，填入上述变量。

---

## 阻塞项 3: Stripe 未配置（可选，不影响 MVP）

**严重度:** P1 — 不阻塞核心功能，但阻塞付费流程

如果要启用付费功能：
1. 创建 Stripe 账号 + 产品 + 价格
2. 配置 Webhook endpoint: `https://<domain>/api/webhooks/stripe`
3. 监听事件: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

**MVP 阶段可以跳过:** 用户默认 `free` 计划，配额 10 次/天，无需 Stripe。

---

## 上线 Checklist

- [ ] 执行数据库迁移（方案 A/B/C 任选）
- [ ] 在 Vercel 配置环境变量
- [ ] Push 到 main 触发自动部署
- [ ] 访问生产域名验证：注册 → 登录 → 优化 → 历史记录
- [ ] （可选）配置 Stripe 付费功能

---

## 已完成的工作

| 阶段 | Commit | 内容 |
|------|--------|------|
| Phase 1 | `d4e17e4` | Next.js 14 架构迁移、Auth、Dashboard、AI 核心 |
| Phase 2 | `c3e0992` | Stripe 支付、多模型、SSE 流式 |
| Phase 3 | `7c6d4da` | CO-STAR 框架、模板库、安全增强 |
| P0-P2 | `460cbc3` | Supabase schema、shadcn/ui、83 测试、CI/CD |

**代码状态:** TypeScript 零错误、83 测试全通过、覆盖率 90%、Next.js 构建通过（需网络访问 Google Fonts）。
