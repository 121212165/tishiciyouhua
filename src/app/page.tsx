import Link from 'next/link'

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'indigo',
    title: '智能优化',
    description: 'AI 自动分析你的提示词，补充缺失的上下文、角色设定和输出格式要求，大幅提升生成质量。',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'purple',
    title: '多模型对比',
    description: '支持 Claude、GPT-4 等主流模型，一键对比不同模型的优化效果，找到最适合你场景的方案。',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'pink',
    title: '历史管理',
    description: '自动保存每次优化记录，支持搜索、收藏和复用，构建你的专属提示词知识库。',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-800">
        <div className="container-app h-16 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            PromptChef
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
            >
              登录
            </Link>
            <Link href="/signup" className="btn-primary text-sm px-4 py-2">
              免费注册
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container-app pt-24 pb-20 text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium">
            AI 驱动的提示词优化
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            让每个人都能写出
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              顶级 AI 提示词
            </span>
          </h1>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto mb-10">
            PromptChef 帮你把模糊的想法变成精准的指令。智能分析、自动优化、多模型对比，让 AI 真正理解你的意图。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary px-8 py-3 text-base">
              免费开始使用
            </Link>
            <Link
              href="#features"
              className="btn-secondary px-8 py-3 text-base"
            >
              了解更多
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container-app pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`card hover:border-${f.color}-500/30 transition-colors`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-${f.color}-500/20 flex items-center justify-center mb-5`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-surface-500">
            PromptChef &copy; {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <span>隐私政策</span>
            <span>服务条款</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
