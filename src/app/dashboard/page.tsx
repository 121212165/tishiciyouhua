import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-surface-50 mb-2">
          欢迎使用 PromptChef
        </h1>
        <p className="text-surface-400">
          开始优化你的提示词，让 AI 输出更精准的结果。
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/optimize"
          className="card group hover:border-indigo-500/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-surface-100 mb-1">开始优化</h3>
              <p className="text-sm text-surface-400">
                输入你的提示词，AI 会帮你优化
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/history"
          className="card group hover:border-purple-500/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-surface-100 mb-1">查看历史</h3>
              <p className="text-sm text-surface-400">
                浏览和复用之前的优化记录
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Usage stats placeholder */}
      <div className="card">
        <h3 className="font-semibold text-surface-100 mb-4">今日使用量</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatItem label="优化次数" value="--" />
          <StatItem label="输入 Tokens" value="--" />
          <StatItem label="输出 Tokens" value="--" />
          <StatItem label="节省时间" value="--" />
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-surface-100">{value}</div>
      <div className="text-xs text-surface-500 mt-1">{label}</div>
    </div>
  )
}
