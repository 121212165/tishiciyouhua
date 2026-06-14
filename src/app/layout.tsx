import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '提示词优化器 - CO-STAR 框架',
  description: '使用 CO-STAR 框架优化你的 AI 提示词',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
