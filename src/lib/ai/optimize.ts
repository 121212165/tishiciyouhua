import { getProvider, type AIResponse } from './provider'
import { STYLES, type Style, buildSystemPromptWithLanguage } from './prompts'
import { type ModelId } from './models'

// ============================================================
// Prompt Injection 防护
// ============================================================

const INJECTION_PATTERNS: readonly RegExp[] = [
  // 经典注入指令
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?prior\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /forget\s+(all\s+)?(your\s+)?instructions/i,
  /override\s+(your\s+)?instructions/i,

  // 角色劫持
  /you\s+are\s+now\s+/i,
  /from\s+now\s+on\s+you\s+are/i,
  /act\s+as\s+(?:a\s+)?(?:different|new)\s+/i,
  /pretend\s+(?:you\s+)?(?:are|to\s+be)\s+(?:a\s+)?(?:different|new)/i,
  /new\s+role\s*:/i,
  /mode\s*:\s*(?:god|admin|root|developer|jailbreak)/i,

  // System/User prompt 注入
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[system\]/i,
  /\[\/system\]/i,
  /##\s*system\s*prompt/i,

  // DAN / Jailbreak 模式
  /do\s+anything\s+now/i,
  /DAN\s+mode/i,
  /jailbreak/i,
  /developer\s+mode/i,
  /bypass\s+(your\s+)?(safety|content|ethical)\s+(filter|policy|restriction)/i,

  // 输出操控
  /repeat\s+(the\s+)?(following|above)\s+(exactly|word\s+for\s+word)/i,
  /output\s+(your\s+)?(system|initial)\s+(prompt|message|instructions)/i,
  /reveal\s+(your\s+)?(system|initial)\s+(prompt|message|instructions)/i,
  /what\s+(are|is)\s+your\s+(system|initial)\s+(prompt|instructions)/i,
  /print\s+(your\s+)?(system|initial)\s+(prompt|instructions)/i,

  // Base64 / 编码绕过
  /(?:base64|rot13|hex)\s*(?:encode|decode|decrypt)/i,
  /atob\s*\(/i,
  /btoa\s*\(/i,
]

// ============================================================
// 有害内容检测
// ============================================================

const HARMFUL_CONTENT_PATTERNS: readonly RegExp[] = [
  // 暴力和伤害
  /(?:how\s+to|教我?|指导)\s*(?:make|build|create|制造|制作|合成)\s*(?:bomb|explosive|weapon|炸弹|爆炸物|武器)/i,
  /(?:how\s+to|教我?|指导)\s*(?:harm|hurt|injure|kill|伤害|杀害)/i,

  // 恶意软件
  /(?:how\s+to|教我?|写一个?)\s*(?:hack|crack|exploit|入侵|破解|攻击)\s*(?:system|server|network|系统|服务器|网络)/i,
  /(?:write|create|生成)\s*(?:malware|virus|trojan|ransomware|恶意软件|病毒|木马|勒索)/i,

  // 身份冒充和社会工程
  /(?:pretend|impersonate|冒充|伪装)\s*(?:to\s+be\s+)?(?:a\s+)?(?:police|officer|bank|doctor|警察|银行|医生)/i,
  /(?:phishing|smishing|钓鱼)\s*(?:email|template|邮件|模板)/i,

  // 非法活动
  /(?:how\s+to|教我?)\s*(?:steal|shoplift|偷|盗窃|抢劫)/i,
  /(?:money\s+laundering|洗钱)/i,
  /(?:drug\s+(?:dealing|trafficking)|毒品|贩毒)/i,
]

// ============================================================
// Input Safety Check
// ============================================================

export function sanitizeInput(prompt: string): { safe: boolean; reason?: string } {
  if (prompt.length > 10000) {
    return { safe: false, reason: '输入超过最大长度限制（10000 字符）' }
  }
  if (prompt.trim().length === 0) {
    return { safe: false, reason: '输入不能为空' }
  }
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return { safe: false, reason: '检测到不安全的输入模式' }
    }
  }
  for (const pattern of HARMFUL_CONTENT_PATTERNS) {
    if (pattern.test(prompt)) {
      return { safe: false, reason: '检测到可能有害的内容请求' }
    }
  }
  return { safe: true }
}

// ============================================================
// Input Quality Assessment
// ============================================================

export interface InputQualityAssessment {
  score: number // 0-100
  issues: string[]
  suggestions: string[]
}

/**
 * 评估用户输入的质量，返回评分、问题列表和改进建议。
 * 这是一个纯函数，不调用 AI，通过启发式规则评估。
 */
export function assessInputQuality(prompt: string): InputQualityAssessment {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 100

  const trimmed = prompt.trim()
  const wordCount = trimmed.length
  const hasQuestionMark = /[?？]/.test(trimmed)
  const hasNewlines = /\n/.test(trimmed)
  const sentenceCount = trimmed.split(/[。！？.!?]+/).filter((s) => s.trim().length > 0).length

  // 1. 长度评估
  if (wordCount < 10) {
    score -= 30
    issues.push('输入过短，信息量不足')
    suggestions.push('请提供更多细节，例如：你想要 AI 扮演什么角色？输出什么格式？')
  } else if (wordCount < 30) {
    score -= 15
    issues.push('输入较短，可能缺少必要上下文')
    suggestions.push('可以补充任务背景、目标受众或输出要求')
  }

  // 2. 是否有明确的任务动词
  const taskVerbs =
    /(?:写|生成|创建|设计|分析|翻译|总结|优化|编写|解释|比较|评估|推荐|列出|描述|计算|搜索|检查|改写)/
  if (!taskVerbs.test(trimmed)) {
    score -= 15
    issues.push('缺少明确的任务指令')
    suggestions.push('使用动词开头明确任务，例如：「写一篇...」「分析以下...」「翻译这段...」')
  }

  // 3. 是否有角色设定
  const hasRole = /(?:你是|作为|扮演|你是一个|你是一位|assume|you are|act as)/i.test(trimmed)
  if (!hasRole && wordCount > 50) {
    score -= 10
    suggestions.push('添加角色设定可以提升输出质量，例如：「你是一位资深...」')
  }

  // 4. 是否有格式要求
  const hasFormat =
    /(?:格式|format|markdown|json|表格|table|列表|list|bullet|代码|code|输出为|output)/i.test(trimmed)
  if (!hasFormat && wordCount > 30) {
    score -= 10
    suggestions.push('指定输出格式可以让结果更符合预期，例如：「以 Markdown 格式输出」「使用表格展示」')
  }

  // 5. 模糊表达检测
  const vagueExpressions =
    /(?:一些|一些东西|好的|合适的|相关的|some|something|good|nice|better|相关的东西)/
  if (vagueExpressions.test(trimmed)) {
    score -= 10
    issues.push('包含模糊表达，可能导致输出不精确')
    suggestions.push('用具体的描述替代模糊表达，例如：将「一些」替换为「3-5 个」')
  }

  // 6. 是否有结构化格式
  if (wordCount > 100 && !hasNewlines) {
    score -= 10
    issues.push('长文本未使用结构化格式')
    suggestions.push('使用换行和 Markdown 格式（标题、列表等）组织内容，提升可读性')
  }

  // 7. 是否有上下文
  const hasContext =
    /(?:背景|context|场景|情况|目的|目标|受众|为了|because|because of|since)/i.test(trimmed)
  if (!hasContext && wordCount > 50) {
    score -= 5
    suggestions.push('补充背景信息和目标可以减少 AI 的猜测，例如：「为了...」「目标受众是...」')
  }

  // 确保分数在 0-100 范围内
  const finalScore = Math.max(0, Math.min(100, score))

  return {
    score: finalScore,
    issues,
    suggestions,
  }
}

// ============================================================
// Optimize Result
// ============================================================

export interface OptimizeResult {
  original: string
  optimized: string
  model: ModelId
  style: Style
  tokensInput: number
  tokensOutput: number
  latencyMs: number
}

// ============================================================
// Main Optimize Function
// ============================================================

/**
 * 优化用户输入的提示词。
 *
 * 函数签名保持不变，确保向后兼容。
 * 内部使用 buildSystemPromptWithLanguage 替代简单的字符串拼接，
 * 以获取包含语言检测、Few-shot 示例和结构化框架的完整系统提示词。
 */
export async function optimizePrompt(
  input: string,
  model: ModelId = 'claude-3-5-sonnet',
  style: Style = 'detailed'
): Promise<OptimizeResult> {
  const safety = sanitizeInput(input)
  if (!safety.safe) throw new Error(safety.reason)

  const systemPrompt = buildSystemPromptWithLanguage(style, input)

  const provider = getProvider(model)
  const startTime = Date.now()
  const response: AIResponse = await provider.optimize(input, systemPrompt, 8192)
  const latencyMs = Date.now() - startTime

  return {
    original: input,
    optimized: response.content,
    model,
    style,
    tokensInput: response.tokensInput,
    tokensOutput: response.tokensOutput,
    latencyMs,
  }
}
