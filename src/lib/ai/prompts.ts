// ============================================================
// Prompt Engineering Framework
// ============================================================
// Uses CO-STAR (Context, Objective, Style, Tone, Audience, Response)
// combined with Chain-of-Thought reasoning and Few-shot examples.
// ============================================================

// --- Language Detection ---

type DetectedLanguage = 'zh' | 'en' | 'ja' | 'ko' | 'other'

function detectLanguage(text: string): DetectedLanguage {
  const samples = text.slice(0, 200)
  if (/[一-鿿]/.test(samples)) return 'zh'
  if (/[぀-ゟ゠-ヿ]/.test(samples)) return 'ja'
  if (/[가-힯]/.test(samples)) return 'ko'
  if (/[a-zA-Z]/.test(samples)) return 'en'
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

const FEW_SHOT_EXAMPLES: FewShotExample[] = [
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
]

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
      '保持精炼，去除冗余表述，只保留核心指令和必要约束。使用短句和关键词，适合快速执行的场景。将长段落压缩为要点列表，避免重复说明。',
  },
  detailed: {
    name: '详细',
    instruction:
      '全面补充上下文、角色设定、格式要求和约束条件。使用 CO-STAR 框架的完整结构，包含背景说明、具体任务描述、输出格式要求和边界条件。适合需要高质量输出的复杂任务。',
  },
  creative: {
    name: '创意',
    instruction:
      '添加创意思维角度，鼓励多角度分析和创新表达。引入类比、比喻和跨领域联想，突破常规思路框架。在结构化的基础上融入发散性思维元素，激发 AI 的创造性输出。',
  },
  academic: {
    name: '学术',
    instruction:
      '采用学术论文的严谨风格，强调逻辑论证和结构化表达。要求引用来源、使用精确术语、保持客观中立的分析立场。添加研究方法论的思考框架，要求分步论证和结论验证。',
  },
  technical: {
    name: '技术文档',
    instruction:
      '采用技术文档的精确风格，适合编程、架构设计和技术方案场景。要求代码示例、API 说明、错误处理方案和技术约束说明。使用开发者友好的术语和格式，包含输入输出规格定义。',
  },
  business: {
    name: '商务',
    instruction:
      '采用专业商务沟通风格，强调结果导向和可执行性。使用结构化的商业分析框架（SWOT、ROI、KPI 等），要求明确的时间线、责任人和交付物。语言简洁专业，避免技术术语堆砌。',
  },
  instruction: {
    name: '指令式',
    instruction:
      '将提示词转化为分步骤的可执行指令序列。每一步使用动词开头，明确输入输出，包含条件分支和异常处理逻辑。适合需要精确控制 AI 执行流程的场景，如工作流自动化和任务编排。',
  },
} as const

export type Style = keyof typeof STYLES

export const STYLE_IDS = Object.keys(STYLES) as Style[]

// --- Helper: Build System Prompt ---

export function buildSystemPrompt(style: Style): string {
  const styleConfig = STYLES[style]
  if (!styleConfig) {
    throw new Error(`未知的优化风格: ${style}`)
  }

  const languageHint = detectLanguage('') // will be overridden at call site

  return `${OPTIMIZE_SYSTEM_PROMPT}

# 当前优化风格
${styleConfig.instruction}

# 输出语言
${LANGUAGE_NAMES[languageHint]}`
}

export function buildSystemPromptWithLanguage(style: Style, inputText: string): string {
  const styleConfig = STYLES[style]
  if (!styleConfig) {
    throw new Error(`未知的优化风格: ${style}`)
  }

  const lang = detectLanguage(inputText)

  return `${OPTIMIZE_SYSTEM_PROMPT}

# 当前优化风格
${styleConfig.instruction}

# 输出语言
使用 ${LANGUAGE_NAMES[lang]} 进行输出，与用户输入语言保持一致。

# 参考示例
以下是优化前后的对比示例，供你理解优化标准（不要照搬内容，只参考优化方法）：

${FEW_SHOT_EXAMPLES.map(
  (ex, i) => `## 示例 ${i + 1}
**用户输入：** ${ex.input}

**优化后：**
${ex.output}`
).join('\n\n')}`
}
