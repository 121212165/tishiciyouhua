// ============================================================
// Prompt Engineering Framework
// ============================================================
// Uses CO-STAR (Context, Objective, Style, Tone, Audience, Response)
// combined with Chain-of-Thought reasoning and Few-shot examples.
// ============================================================

// --- Language Detection ---

type DetectedLanguage = 'zh' | 'en' | 'ja' | 'ko' | 'other'

function detectLanguage(text: string): DetectedLanguage {
  if (text.length === 0) return 'other'

  // Sample from beginning, middle, and end to handle mixed-language text
  const sampleSize = 200
  const samples: string[] = []
  samples.push(text.slice(0, sampleSize))
  if (text.length > sampleSize * 2) {
    const mid = Math.floor(text.length / 2)
    samples.push(text.slice(mid - sampleSize / 2, mid + sampleSize / 2))
  }
  if (text.length > sampleSize) {
    samples.push(text.slice(-sampleSize))
  }
  const combined = samples.join('')

  // Count characters by class ratio across all samples
  let zhCount = 0
  let jaCount = 0
  let koCount = 0
  let enCount = 0

  for (const ch of combined) {
    const code = ch.codePointAt(0)!
    // CJK Unified Ideographs (includes Chinese)
    if (code >= 0x4e00 && code <= 0x9fff) zhCount++
    // CJK Compatibility Ideographs
    else if (code >= 0xf900 && code <= 0xfaff) zhCount++
    // Hiragana + Katakana (Japanese-specific)
    else if ((code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)) jaCount++
    // Hangul (Korean)
    else if (code >= 0xac00 && code <= 0xd7af) koCount++
    // Latin letters
    else if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) enCount++
  }

  const nonLatinTotal = zhCount + jaCount + koCount
  // If most of the text is Latin, return English
  if (nonLatinTotal === 0 && enCount > 0) return 'en'
  if (enCount > 0 && enCount > nonLatinTotal * 3) return 'en'

  // For CJK: check if Japanese-specific characters exist; otherwise default to Chinese
  if (jaCount > 0 && jaCount > zhCount * 0.3) return 'ja'
  if (koCount > 0 && koCount > zhCount * 0.3) return 'ko'
  if (zhCount > 0) return 'zh'
  if (enCount > 0) return 'en'

  return 'other'
}

const LANGUAGE_NAMES: Record<DetectedLanguage, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  other: '与用户输入相同的语言',
}

// --- Quality Assessment Dimensions ---

export interface QualityDimension {
  name: string
  description: string
  weight: number
}

export const QUALITY_DIMENSIONS: readonly QualityDimension[] = [
  { name: '清晰度', description: '指令是否明确、无歧义', weight: 0.25 },
  { name: '完整性', description: '是否包含角色、任务、格式、约束等必要要素', weight: 0.25 },
  { name: '可执行性', description: 'AI 是否能直接按此指令执行', weight: 0.20 },
  { name: '结构化', description: '是否使用了合理的层次和格式组织', weight: 0.15 },
  { name: '上下文', description: '是否提供了足够的背景信息和示例', weight: 0.15 },
] as const

// --- Few-shot Examples ---

interface FewShotExample {
  input: string
  output: string
}

const FEW_SHOT_EXAMPLES: Record<string, FewShotExample[]> = {
  concise: [
    {
      input: '帮我写一篇关于 AI 的文章',
      output: `# 优化后的提示词

## 角色
资深科技记者，专注 AI 领域。

## 任务
撰写 AI 现状与趋势分析文章（1500 字）。

## 要求
- 涵盖：大模型突破、行业应用、挑战、未来预测
- 面向非技术读者，通俗易懂
- 每个论点配数据支撑
- 输出 Markdown 格式`,
    },
    {
      input: '写一个排序算法',
      output: `# 优化后的提示词

## 角色
算法工程师。

## 任务
TypeScript 实现归并排序（Merge Sort）。

## 要求
- 泛型签名：\`mergeSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[]\`
- 不可变：返回新数组
- 包含 JSDoc 复杂度注释
- 附带 5 个测试用例（空/单/已排序/逆序/重复）`,
    },
  ],
  detailed: [
    {
      input: '帮我写一篇关于 AI 的文章',
      output: `# 优化后的提示词

## 角色
你是一位资深科技记者，专注于人工智能领域的深度报道，拥有计算机科学和新闻传播双重背景。

## 任务
撰写一篇关于人工智能现状与未来趋势的深度分析文章（1500-2000 字）。

## 要求
1. 涵盖以下维度：
   - 2024-2025 年关键技术突破（大语言模型、多模态、Agent 等）
   - 主要行业应用案例（医疗、教育、金融、制造）
   - 面临的挑战（安全、伦理、监管、能源消耗）
   - 未来 3-5 年的发展预测

2. 写作风格：
   - 面向有一定技术背景但非专业人员的读者
   - 使用通俗易懂的类比解释技术概念
   - 每个论点配合具体案例或数据支撑
   - 保持客观中立的分析立场

3. 输出格式：
   - 使用 Markdown 格式
   - 包含标题、子标题、要点列表
   - 在文末附上 3-5 个延伸阅读建议

## 约束
- 不使用未经证实的数据或预测
- 避免过度技术化的术语堆砌
- 不做夸大其词的宣传性表述`,
    },
    {
      input: '写一个排序算法',
      output: `# 优化后的提示词

## 角色
你是一位算法工程师，擅长编写高效、可读的算法实现。

## 任务
实现一个归并排序（Merge Sort）算法。

## 具体要求
1. 使用 TypeScript 编写
2. 实现以下功能：
   - 泛型支持：\`mergeSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[]\`
   - 原始数组不变，返回新数组
   - 空数组和单元素数组直接返回

3. 代码规范：
   - 添加 JSDoc 注释说明时间/空间复杂度
   - 关键步骤添加行内注释
   - 包含边界条件处理

4. 附带测试用例：
   - 空数组、单元素、已排序、逆序、含重复元素
   - 数字和字符串两种类型的测试

## 输出格式
- 先简要说明算法思路（2-3 句话）
- 然后给出完整代码
- 最后给出测试用例`,
    },
    {
      input: '分析一下我们公司的销售数据',
      output: `# 优化后的提示词

## 角色
你是一位资深商业数据分析师，精通数据可视化和业务洞察。

## 任务
对公司最近 12 个月的销售数据进行全面分析，生成季度分析报告。

## 数据说明
数据包含以下字段：
- 日期、产品类别、销售额、销售量、客户地区、销售渠道

## 分析维度
请从以下角度进行分析：

1. **趋势分析**
   - 月度/季度销售趋势
   - 同比/环比增长率
   - 识别增长和下滑的时间节点

2. **产品分析**
   - 各品类销售占比及变化
   - 畅销品和滞销品识别
   - 产品组合优化建议

3. **区域分析**
   - 各地区销售表现
   - 高潜力区域识别
   - 区域差异化策略建议

4. **渠道分析**
   - 各渠道贡献度
   - 渠道效率对比
   - 渠道资源分配建议

## 输出格式
- 使用 Markdown 表格展示数据
- 每个维度给出「发现 -> 分析 -> 建议」结构
- 总结 3-5 条可执行的业务建议
- 标注置信度（高/中/低）`,
    },
  ],
  creative: [
    {
      input: '帮我写一篇关于 AI 的文章',
      output: `# 优化后的提示词

## 角色
你是一位科学散文作家，擅长用文学笔法解读前沿科技，将抽象概念转化为生动的故事和意象。

## 任务
撰写一篇关于人工智能的创意散文（1200-1500 字），以「AI 是什么」为题，用独特的视角和叙事方式呈现。

## 创意要求
- 选择一个出人意料的切入点（如：从一封未来邮件、一次博物馆导览、一棵数据之树的年轮）
- 使用隐喻和类比让技术概念变得可感知
- 在严谨的事实基础上融入诗意表达
- 结尾留有开放性的思考空间，引发读者共鸣

## 输出格式
- 散文体，不需要标题分级
- 段落之间留白，营造阅读节奏
- 可在文末附一段创作手记，说明构思意图`,
    },
  ],
  technical: [
    {
      input: '写一个排序算法',
      output: `# 优化后的提示词

## 角色
你是一位 TypeScript 核心库维护者，负责编写高质量的工具函数库。

## 任务
实现一个生产级归并排序（Merge Sort）函数。

## API 签名
\`\`\`typescript
function mergeSort<T>(
  arr: readonly T[],
  compareFn: (a: T, b: T) => number
): T[]
\`\`\`

## 技术规格
- 时间复杂度：O(n log n) — 包含证明
- 空间复杂度：O(n) — 说明原因
- 稳定性：稳定排序 — 标注在 JSDoc 中
- 不修改输入数组，返回新数组实例

## 代码规范
- JSDoc 包含 \`@template\`, \`@param\`, \`@returns\`, \`@example\`
- 关键步骤添加行内注释
- 处理边界：空数组、单元素、已排序、逆序、含 undefined 元素
- 导出方式：具名导出 + 默认导出

## 测试
- 使用 Vitest 编写测试套件
- 覆盖率要求：分支 100%，语句 100%
- 测试用例：空数组、单元素、双元素、已排序、逆序、含重复、随机大数组（1000+元素）
- 性能基准：1000 元素排序 < 5ms`,
    },
  ],
}

/** Default examples used for styles without a dedicated set */
const FEW_SHOT_EXAMPLES_DEFAULT: FewShotExample[] = FEW_SHOT_EXAMPLES['detailed']!

// --- Core System Prompt ---

export const OPTIMIZE_SYSTEM_PROMPT = `# 角色 (Role)
你是一位世界顶级的 AI 提示词工程师（Prompt Engineer），专精于将模糊、简短的用户输入转化为结构化、高效、可执行的 AI 提示词。你深入理解大语言模型的工作原理，包括注意力机制、上下文窗口、指令跟随模式等。

# 任务 (Task)
将用户输入的原始提示词进行系统性优化，使其达到专业级提示词标准。

# 优化方法论 (Methodology)

## 第一步：意图解析
- 识别用户的核心目标和隐含需求
- 判断任务类型（生成、分析、翻译、编程、创意等）
- 识别缺失的关键信息

## 第二步：结构化框架 (CO-STAR)
按以下框架组织优化后的提示词：

1. **Context（上下文）**：补充背景信息和场景设定
2. **Objective（目标）**：明确具体的任务目标
3. **Style（风格）**：指定输出的写作风格
4. **Tone（语气）**：设定合适的表达语气
5. **Audience（受众）**：明确目标读者或使用者
6. **Response（响应格式）**：定义期望的输出格式和结构

## 第三步：Chain-of-Thought 引导
- 对复杂任务，添加分步思考的引导
- 要求 AI 先分析再执行
- 添加验证步骤确保输出质量

## 第四步：质量增强
- 添加具体约束条件以避免歧义
- 提供正例/反例以校准输出
- 设定评估标准和自检清单

# 优化原则 (Principles)
1. **忠于原意**：永远不改变用户的核心意图，只增强表达
2. **适度优化**：如果用户输入已经足够好，只做针对性微调，不要过度添加
3. **实用优先**：优化后的提示词必须可以直接使用，而非纯理论框架
4. **层次清晰**：使用 Markdown 标题、列表、代码块等格式提升可读性
5. **语言一致**：使用与用户输入相同的语言进行优化输出

# 输出规则 (Output Rules)
- 直接输出优化后的提示词，不要输出解释性文字或前言
- 使用 Markdown 格式组织内容
- 如果用户输入已经足够优化，只需微调并保持原结构
- 确保优化后的提示词可以直接复制使用` as const

// --- Style Definitions ---

export interface StyleConfig {
  name: string
  instruction: string
}

export const STYLES: Record<string, StyleConfig> = {
  concise: {
    name: '简洁',
    instruction:
      '保持精炼，去除冗余表述，只保留核心指令和必要约束。使用短句和关键词，适合快速执行的场景。将长段落压缩为要点列表，避免重复说明。输出不超过原输入长度的 2 倍。使用要点列表（bullet points）替代长段落。',
  },
  detailed: {
    name: '详细',
    instruction:
      '全面补充上下文、角色设定、格式要求和约束条件。使用 CO-STAR 框架的完整结构，包含背景说明、具体任务描述、输出格式要求和边界条件。适合需要高质量输出的复杂任务。每个维度至少包含 3 个具体要点。使用 Markdown 标题分级（至少 3 层：\`##\` / \`###\` / \`####\`）。',
  },
  creative: {
    name: '创意',
    instruction:
      '添加创意思维角度，鼓励多角度分析和创新表达。引入类比、比喻和跨领域联想，突破常规思路框架。在结构化的基础上融入发散性思维元素，激发 AI 的创造性输出。至少使用 1 个类比或隐喻来解释核心概念。要求「跳出常规」的提示语，如：换个角度、类比其他领域。',
  },
  academic: {
    name: '学术',
    instruction:
      '采用学术论文的严谨风格，强调逻辑论证和结构化表达。要求引用来源、使用精确术语、保持客观中立的分析立场。添加研究方法论的思考框架，要求分步论证和结论验证。必须包含参考文献格式的引用（如 [Author, Year]）。使用「摘要 -> 方法 -> 论证 -> 结论」的结构。',
  },
  technical: {
    name: '技术文档',
    instruction:
      '采用技术文档的精确风格，适合编程、架构设计和技术方案场景。要求代码示例、API 说明、错误处理方案和技术约束说明。使用开发者友好的术语和格式，包含输入输出规格定义。必须包含至少 1 个可运行的代码示例（含语言标注的代码块）。使用表格展示参数/返回值规格。',
  },
  business: {
    name: '商务',
    instruction:
      '采用专业商务沟通风格，强调结果导向和可执行性。使用结构化的商业分析框架（SWOT、ROI、KPI 等），要求明确的时间线、责任人和交付物。语言简洁专业，避免技术术语堆砌。必须包含明确的「行动项」（Action Items）清单，注明优先级和时间线。',
  },
  instruction: {
    name: '指令式',
    instruction:
      '将提示词转化为分步骤的可执行指令序列。每一步使用动词开头，明确输入输出，包含条件分支和异常处理逻辑。适合需要精确控制 AI 执行流程的场景，如工作流自动化和任务编排。每步骤使用编号列表（1. 2. 3. ...）。包含「输入」和「输出」规格说明。',
  },
} as const

export type Style = keyof typeof STYLES

export const STYLE_IDS = Object.keys(STYLES) as Style[]

// --- Helper: Build System Prompt ---

export function buildSystemPromptWithLanguage(style: Style, inputText: string): string {
  const styleConfig = STYLES[style]
  if (!styleConfig) {
    throw new Error(`未知的优化风格: ${style}`)
  }

  const lang = detectLanguage(inputText)
  const examples = FEW_SHOT_EXAMPLES[style] ?? FEW_SHOT_EXAMPLES_DEFAULT

  return `${OPTIMIZE_SYSTEM_PROMPT}

# 当前优化风格
${styleConfig.instruction}

# 输出语言
使用 ${LANGUAGE_NAMES[lang]} 进行输出，与用户输入语言保持一致。

# 参考示例
以下是优化前后的对比示例，供你理解优化标准（不要照搬内容，只参考优化方法）：

${examples.map(
  (ex, i) => `## 示例 ${i + 1}
**用户输入：** ${ex.input}

**优化后：**
${ex.output}`
).join('\n\n')}`
}
