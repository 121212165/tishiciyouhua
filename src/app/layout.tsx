import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'tishiciyouhua - AI 提示词优化工具',
    template: '%s | tishiciyouhua',
  },
  description: '让每个人都能写出顶级 AI 提示词。智能优化、模板管理、一键生成。',
  keywords: ['AI', '提示词', 'prompt', '优化', 'Claude', 'GPT'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-surface-950 font-sans text-surface-50 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
