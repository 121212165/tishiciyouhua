export function sanitizeInput(prompt: string): { safe: boolean; reason?: string } {
  if (prompt.length > 10000) {
    return { safe: false, reason: '输入超过最大长度限制（10000 字符）' }
  }
  if (prompt.trim().length === 0) {
    return { safe: false, reason: '输入不能为空' }
  }
  return { safe: true }
}
