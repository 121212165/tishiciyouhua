'use client'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-50 mb-1">设置</h1>
        <p className="text-sm text-surface-400">管理你的账号和偏好</p>
      </div>

      {/* Profile */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">个人信息</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              邮箱
            </label>
            <input
              type="email"
              disabled
              value="--"
              className="input-field opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              显示名称
            </label>
            <input
              type="text"
              placeholder="设置显示名称"
              className="input-field"
            />
          </div>
          <button className="btn-primary text-sm" disabled>
            保存（即将支持）
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">偏好设置</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              默认模型
            </label>
            <select className="input-field" disabled>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
            <p className="mt-1 text-xs text-surface-500">更多模型即将支持</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              默认优化风格
            </label>
            <select className="input-field" disabled>
              <option value="detailed">详细</option>
            </select>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">使用量统计</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <UsageStat label="总优化次数" value="--" />
          <UsageStat label="本月优化次数" value="--" />
          <UsageStat label="总 Tokens 消耗" value="--" />
          <UsageStat label="预估节省时间" value="--" />
        </div>
      </section>

      {/* Subscription placeholder */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">订阅管理</h2>
        <div className="flex items-center justify-between max-w-md">
          <div>
            <p className="text-sm text-surface-200">当前计划：免费版</p>
            <p className="text-xs text-surface-500 mt-1">高级订阅即将推出</p>
          </div>
          <button className="btn-secondary text-sm" disabled>
            升级（即将支持）
          </button>
        </div>
      </section>
    </div>
  )
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-surface-100">{value}</div>
      <div className="text-xs text-surface-500 mt-1">{label}</div>
    </div>
  )
}
