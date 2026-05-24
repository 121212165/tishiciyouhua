/**
 * PromptChef - 提示词工程技术库
 *
 * 从以下开源资源中提炼的提示词工程技术：
 * - NirDiamant/Prompt_Engineering (7.5K+ stars) - 22 种提示词工程技术
 * - microsoft/promptbase (5.7K+ stars) - Medprompt 方法论
 * - brexhq/prompt-engineering (9.5K+ stars) - 生产级策略
 * - dair-ai/Prompt-Engineering-Guide (75K+ stars) - 综合指南
 * - anthropics/prompt-eng-interactive-tutorial (36K+ stars) - Anthropic 官方教程
 * - ai-boost/awesome-prompts (8K+ stars) - GPT 提示词集合
 *
 * 所有描述和示例均为原创整理。
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PromptTechnique {
  id: string
  name: string
  nameZh: string
  description: string
  example: string
  applicableStyles: string[]
  difficulty: 'basic' | 'intermediate' | 'advanced'
  useCases: string[]
}

// ---------------------------------------------------------------------------
// Techniques
// ---------------------------------------------------------------------------

export const PROMPT_TECHNIQUES: readonly PromptTechnique[] = [
  // ------------------------------------------------------------------
  // 1. Chain-of-Thought (CoT)
  // ------------------------------------------------------------------
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought',
    nameZh: '思维链',
    description:
      '引导模型逐步推理而非直接给出答案。通过添加"让我们逐步思考"或提供分步示例，' +
      '模型会展示中间推理过程，显著提升数学、逻辑和复杂推理任务的准确率。' +
      'Google Brain 在 2022 年的研究表明，CoT 可以将 GSM8K 数学基准的准确率从 18% 提升到 57%。',
    example: `问题：一个商店有 23 个苹果，卖了 7 个后又进了 12 个，现在有多少？

让我们逐步思考：
1. 初始数量：23 个苹果
2. 卖出后：23 - 7 = 16 个苹果
3. 进货后：16 + 12 = 28 个苹果

所以现在有 28 个苹果。`,
    applicableStyles: ['detailed', 'concise'],
    difficulty: 'basic',
    useCases: ['数学计算', '逻辑推理', '代码调试', '因果分析', '决策分析'],
  },

  // ------------------------------------------------------------------
  // 2. Few-Shot Learning
  // ------------------------------------------------------------------
  {
    id: 'few-shot',
    name: 'Few-Shot Learning',
    nameZh: '少样本学习',
    description:
      '在提示词中提供少量输入-输出示例（通常 2-5 个），让模型从示例中学习任务模式和输出格式。' +
      'GPT-3 论文"Language Models are Few-Shot Learners"首次系统展示了这一能力。' +
      '示例的选择和排序会显著影响结果质量，建议选择多样化且具代表性的示例。',
    example: `请根据评论判断情感倾向。

评论：这个产品太好用了，物超所值！
情感：正面

评论：包装破损，质量很差，非常失望。
情感：负面

评论：还行吧，中规中矩，没什么特别的。
情感：中性

评论：客服态度很好，但物流太慢了，等了两周。
情感：`,
    applicableStyles: ['detailed', 'concise'],
    difficulty: 'basic',
    useCases: ['文本分类', '情感分析', '格式转换', '风格模仿', '数据提取'],
  },

  // ------------------------------------------------------------------
  // 3. Role Prompting
  // ------------------------------------------------------------------
  {
    id: 'role-prompting',
    name: 'Role Prompting',
    nameZh: '角色设定',
    description:
      '为模型分配特定身份或专家角色，激活其在特定领域的知识和表达方式。' +
      '有效的角色设定应包含：身份、经验背景、专业领域、沟通风格。' +
      '研究表明，角色设定可以影响模型的输出质量、语气和专业深度，' +
      '相当于为模型的知识检索设定了一个更精确的搜索空间。',
    example: `你是一位拥有 15 年经验的高级数据库架构师，精通 PostgreSQL 和分布式系统设计。
你擅长用清晰的类比解释复杂概念，并且总是在给出建议时附上权衡分析。

问题：我们应该选择分库分表还是使用 Citus 来扩展我们的 PostgreSQL 数据库？`,
    applicableStyles: ['detailed', 'creative'],
    difficulty: 'basic',
    useCases: ['专业咨询', '代码审查', '翻译润色', '教学辅导', '创意写作'],
  },

  // ------------------------------------------------------------------
  // 4. Step-by-Step Instructions
  // ------------------------------------------------------------------
  {
    id: 'step-by-step',
    name: 'Step-by-Step Instructions',
    nameZh: '分步指令',
    description:
      '将复杂任务分解为清晰的、有序的步骤。每一步都有明确的输入、操作和预期输出。' +
      '这种技术减少了模型跳步或遗漏关键环节的概率，特别适合多步骤工作流和流程性任务。' +
      'Microsoft 的研究（Medprompt 方法论）表明，结构化的分步指令可以显著提升模型在复杂基准测试上的表现。',
    example: `请按以下步骤分析这段代码：

步骤 1：理解功能
- 代码的输入是什么？
- 代码的输出是什么？
- 整体做了什么？

步骤 2：检查正确性
- 边界条件是否处理？
- 是否有潜在的空值错误？

步骤 3：评估性能
- 时间复杂度是多少？
- 是否有不必要的重复计算？

步骤 4：给出建议
- 列出发现的问题
- 按严重程度排序
- 给出具体修改方案`,
    applicableStyles: ['detailed'],
    difficulty: 'basic',
    useCases: ['代码审查', '数据分析', '问题诊断', '流程设计', '教学指导'],
  },

  // ------------------------------------------------------------------
  // 5. Self-Consistency
  // ------------------------------------------------------------------
  {
    id: 'self-consistency',
    name: 'Self-Consistency',
    nameZh: '自我一致性',
    description:
      '让模型通过多条不同的推理路径解决问题，然后选择出现频率最高的答案作为最终结果。' +
      '这种方法利用了"多数投票"的思想——如果多条推理路径都指向同一个答案，' +
      '那么这个答案正确的概率更高。' +
      'Wang et al. (2022) 的研究表明，Self-Consistency 在数学和推理任务上比单次 CoT 提升 5-15%。',
    example: `请用三种不同的方法解决这个问题，并在最后对比三种方法的答案：

问题：如果一件商品先涨价 20%，再降价 20%，最终价格比原价高还是低？

方法一（直接计算）：...
方法二（代数推理）：...
方法三（数值举例）：...

最终答案（三种方法一致的结论）：...`,
    applicableStyles: ['detailed'],
    difficulty: 'intermediate',
    useCases: ['数学推理', '逻辑判断', '事实验证', '风险评估'],
  },

  // ------------------------------------------------------------------
  // 6. Tree-of-Thought (ToT)
  // ------------------------------------------------------------------
  {
    id: 'tree-of-thought',
    name: 'Tree-of-Thought',
    nameZh: '思维树',
    description:
      '将推理过程组织为树状结构，在每个决策节点探索多条可能的路径，评估各路径的前景，' +
      '然后选择最有希望的方向继续深入。这类似于下棋时的搜索树——' +
      '不是走一步看一步，而是前瞻性地评估多条路线。' +
      'Yao et al. (2023) 提出的 ToT 框架在创意写作和规划任务上显著优于标准 CoT。',
    example: `请用思维树方法解决这个规划问题：

问题：为一个 5 人创业团队设计技术架构。

第一层：选择架构模式
├── 方案 A：单体架构 → 评估：开发快但扩展性差
├── 方案 B：微服务 → 评估：扩展性好但团队太小
└── 方案 C：模块化单体 → 评估：兼顾两者 ✅ 选择此路径

第二层（基于 C）：选择技术栈
├── 方案 C1：Node.js + PostgreSQL
├── 方案 C2：Python + PostgreSQL → 评估：更适合 AI 场景 ✅
└── 方案 C3：Go + PostgreSQL

最终方案：模块化单体 + Python + PostgreSQL，理由：...`,
    applicableStyles: ['detailed', 'creative'],
    difficulty: 'advanced',
    useCases: ['架构设计', '战略规划', '创意探索', '复杂决策', '方案评估'],
  },

  // ------------------------------------------------------------------
  // 7. ReAct (Reasoning + Acting)
  // ------------------------------------------------------------------
  {
    id: 'react',
    name: 'ReAct',
    nameZh: '推理与行动交替',
    description:
      '让模型交替进行"推理"（Reasoning）和"行动"（Acting），' +
      '先思考当前状况和下一步该做什么，然后执行一个具体动作，' +
      '观察结果后再进行下一轮推理。这模拟了人类解决复杂问题时' +
      '思考-行动-观察的循环过程。' +
      'Yao et al. (2022) 的研究表明，ReAct 框架在知识密集型任务和决策任务上' +
      '优于单独的推理或行动方法。',
    example: `请用 ReAct 模式分析这个问题：

问题：找出我们 Web 应用加载慢的原因。

Thought 1: 需要先了解前端加载的主要资源。
Action 1: 列出页面加载时请求的所有资源（HTML、CSS、JS、图片、API 调用）。
Observation 1: 发现有 45 个请求，其中 20 个是第三方脚本。

Thought 2: 20 个第三方脚本可能是瓶颈，需要检查它们的加载方式。
Action 2: 检查这些脚本是否使用了 async/defer 属性。
Observation 2: 12 个脚本是同步加载的，阻塞了页面渲染。

Thought 3: 找到了主要瓶颈，还需要检查图片优化。
Action 3: 检查图片格式和大小。
Observation 3: 首屏图片未压缩，总共 5MB。

结论：三个优化方向，按优先级：1) 异步加载第三方脚本 2) 图片压缩和懒加载 3) ...`,
    applicableStyles: ['detailed'],
    difficulty: 'advanced',
    useCases: ['问题诊断', '调试流程', '研究分析', '信息检索', '复杂规划'],
  },

  // ------------------------------------------------------------------
  // 8. Delimiter-based Structuring
  // ------------------------------------------------------------------
  {
    id: 'delimiter-structuring',
    name: 'Delimiter-based Structuring',
    nameZh: '分隔符结构化',
    description:
      '使用明确的分隔符（如 XML 标签、Markdown 标题、代码围栏等）将提示词的不同部分清晰分隔，' +
      '帮助模型准确区分指令、上下文、输入数据和期望输出。' +
      'Brex 的工程团队在生产环境中发现，清晰的分隔符可以减少模型误解指令的概率约 30%。' +
      '推荐使用 XML 标签（如 <context>、<task>）或 Markdown 标题作为分隔符。',
    example: `# 角色
你是一位数据分析师。

# 任务
分析以下 CSV 数据并生成报告。

# 数据
\`\`\`csv
日期,销售额,成本
2024-01,10000,7000
2024-02,12000,7500
2024-03,8000,6800
\`\`\`

# 要求
- 计算利润率
- 识别趋势
- 给出建议

# 输出格式
使用 Markdown 表格和要点列表。`,
    applicableStyles: ['detailed', 'concise'],
    difficulty: 'basic',
    useCases: ['所有任务', '复杂输入', '多段落指令', '代码相关任务'],
  },

  // ------------------------------------------------------------------
  // 9. Negative Prompting
  // ------------------------------------------------------------------
  {
    id: 'negative-prompting',
    name: 'Negative Prompting',
    nameZh: '反向提示',
    description:
      '明确告诉模型"不要做什么"，与正面指令互补，帮助约束输出范围。' +
      '这在避免幻觉、控制输出格式、排除不想要的内容方面特别有效。' +
      '例如，"不要编造数据"比"使用真实数据"更不容易产生幻觉输出。',
    example: `请撰写一份产品评测。

务必做到：
- 基于真实的使用场景和功能
- 使用客观的评估标准

务必避免：
- 不要使用过度营销的语气
- 不要编造未经验证的数据或排名
- 不要使用"最好的"、"革命性的"等绝对化表述
- 不要回避产品的缺点，要客观指出不足`,
    applicableStyles: ['detailed', 'concise'],
    difficulty: 'basic',
    useCases: ['内容生成', '代码生成', '数据分析', '格式控制'],
  },

  // ------------------------------------------------------------------
  // 10. Prompt Chaining
  // ------------------------------------------------------------------
  {
    id: 'prompt-chaining',
    name: 'Prompt Chaining',
    nameZh: '提示链',
    description:
      '将一个复杂任务拆分为多个子任务，每个子任务对应一个提示词，' +
      '前一个提示词的输出作为后一个的输入，形成处理流水线。' +
      '这种方法让每一步都可以独立验证和优化，同时保持整体流程的可控性。' +
      'Anthropic 的教程中强调，提示链是处理复杂工作流的最佳实践之一。',
    example: `提示链示例：内容创作流水线

提示 1（选题）：根据行业趋势，为技术博客生成 3 个选题建议。
→ 输出：3 个选题

提示 2（大纲）：围绕选题"[用户选择的选题]"，设计文章大纲。
→ 输出：文章大纲

提示 3（初稿）：根据以下大纲撰写文章初稿：[大纲内容]
→ 输出：文章初稿

提示 4（润色）：优化以下文章的可读性和 SEO：[初稿内容]
→ 输出：最终文章`,
    applicableStyles: ['detailed'],
    difficulty: 'intermediate',
    useCases: ['内容创作', '数据分析流水线', '代码生成', '报告撰写', '翻译润色'],
  },

  // ------------------------------------------------------------------
  // 11. Constrained Generation
  // ------------------------------------------------------------------
  {
    id: 'constrained-generation',
    name: 'Constrained Generation',
    nameZh: '约束生成',
    description:
      '通过明确的格式约束（如 JSON Schema、表格模板、固定结构）来限制模型的输出格式，' +
      '确保输出可以直接被程序解析和使用。' +
      'Brex 的工程师发现，在生产系统中使用格式约束可以将输出解析的成功率从 75% 提升到 99%。' +
      '对于需要程序化处理的场景，这是最重要的技术之一。',
    example: `请分析以下用户反馈，并按指定 JSON 格式输出：

用户反馈："界面很好看，但是搜索功能有时候找不到结果，希望能加上筛选功能。"

输出格式：
{
  "sentiment": "positive" | "negative" | "mixed",
  "topics": ["topic1", "topic2"],
  "feature_requests": [
    {
      "feature": "功能描述",
      "priority": "high" | "medium" | "low",
      "reason": "原因"
    }
  ],
  "pain_points": ["痛点1", "痛点2"],
  "action_items": ["建议1", "建议2"]
}`,
    applicableStyles: ['detailed', 'concise'],
    difficulty: 'intermediate',
    useCases: ['API 集成', '数据提取', '自动化处理', '结构化输出', '批处理'],
  },

  // ------------------------------------------------------------------
  // 12. Task Decomposition
  // ------------------------------------------------------------------
  {
    id: 'task-decomposition',
    name: 'Task Decomposition',
    nameZh: '任务分解',
    description:
      '将一个复杂任务分解为更小、更易管理的子任务，每个子任务可以用独立的提示词处理。' +
      '与 Prompt Chaining 不同，Task Decomposition 侧重于分析和规划阶段，' +
      '强调在开始执行之前先理清任务的组成部分和依赖关系。' +
      '这类似于软件工程中的需求分解——先理解全貌，再逐步实现。',
    example: `任务：构建一个用户认证系统

分解分析：
1. 前端组件（可并行）
   1.1 登录表单
   1.2 注册表单
   1.3 忘记密码流程
   1.4 路由守卫

2. 后端 API（可并行，但需要先于前端完成 Schema）
   2.1 /auth/register
   2.2 /auth/login
   2.3 /auth/refresh-token
   2.4 /auth/forgot-password

3. 数据层（最先完成）
   3.1 用户表 Schema
   3.2 会话管理
   3.3 密码加密工具

依赖关系：3 → 2 → 1
并行机会：2.1-2.4 可并行，1.1-1.4 可并行`,
    applicableStyles: ['detailed'],
    difficulty: 'intermediate',
    useCases: ['项目规划', '架构设计', '代码重构', '学习计划', '复杂问题求解'],
  },

  // ------------------------------------------------------------------
  // 13. Dynamic Few-Shot (Medprompt)
  // ------------------------------------------------------------------
  {
    id: 'dynamic-few-shot',
    name: 'Dynamic Few-Shot',
    nameZh: '动态少样本',
    description:
      'Microsoft Medprompt 方法论的核心技术之一。不同于固定使用相同的示例，' +
      '而是根据当前输入动态选择最相关的示例。通常使用嵌入向量（embedding）计算' +
      '输入与候选示例之间的语义相似度，选择最相近的 k 个作为 few-shot 示例。' +
      '这种方法在微软的 MMLU 基准测试中提升了约 3% 的准确率。',
    example: `（概念示例，需要嵌入向量支持）

知识库中有 100 个分类示例。
用户输入："这条评论说产品质量很好但物流太慢"

系统自动检索最相似的 3 个示例：
→ 示例 1：关于产品和物流的评论 → 分类：mixed
→ 示例 2：关于产品质量的评论 → 分类：positive
→ 示例 3：关于物流体验的评论 → 分类：negative

组装 prompt：将这 3 个示例 + 用户输入发送给模型`,
    applicableStyles: ['detailed'],
    difficulty: 'advanced',
    useCases: ['分类任务', '推荐系统', '检索增强', '个性化响应', '知识问答'],
  },

  // ------------------------------------------------------------------
  // 14. Meta-Prompting
  // ------------------------------------------------------------------
  {
    id: 'meta-prompting',
    name: 'Meta-Prompting',
    nameZh: '元提示',
    description:
      '使用一个提示词来生成或优化另一个提示词。这是一种"提示词生成提示词"的技术，' +
      '让模型充当提示词工程师的角色，根据任务需求自动设计最佳提示词。' +
      '这种方法特别适合 PromptChef 工具本身——利用 LLM 的知识来优化用户输入的提示词。',
    example: `你是一位提示词工程专家。我需要你帮我设计一个提示词来完成以下任务：

任务描述：{用户输入的任务}

请输出一个优化后的提示词，包含：
1. 角色设定（适合该任务的专家角色）
2. 任务描述（清晰、具体的指令）
3. 格式要求（输出的结构和格式）
4. 约束条件（避免什么、注意什么）
5. 示例（如果任务需要）

只输出优化后的提示词，不要解释。`,
    applicableStyles: ['detailed', 'creative'],
    difficulty: 'intermediate',
    useCases: ['提示词优化', '自动提示词生成', '提示词模板创建', '批量优化'],
  },

  // ------------------------------------------------------------------
  // 15. Iterative Refinement
  // ------------------------------------------------------------------
  {
    id: 'iterative-refinement',
    name: 'Iterative Refinement',
    nameZh: '迭代优化',
    description:
      '让模型先生成初始输出，然后自我审查并改进。这模拟了人类的写作-修改-润色流程。' +
      '每一轮迭代都聚焦于不同的改进维度（如第一轮关注内容完整性，第二轮关注语言流畅度，' +
      '第三轮关注格式规范）。多轮迭代通常比单轮生成质量更高。',
    example: `请用三轮迭代来撰写这段文案：

第一轮（内容）：写出包含所有要点的初稿。
→ 输出初稿

第二轮（优化）：审查初稿，改进以下方面：
- 删除冗余内容
- 加强说服力
- 优化用词
→ 输出改进版

第三轮（精炼）：最终打磨：
- 检查语气一致性
- 确保字数在要求范围内
- 优化开头和结尾
→ 输出最终版`,
    applicableStyles: ['detailed', 'creative'],
    difficulty: 'intermediate',
    useCases: ['文案撰写', '代码优化', '翻译润色', '报告生成', '论文写作'],
  },
]

// ---------------------------------------------------------------------------
// Technique Styles Mapping
// ---------------------------------------------------------------------------

/** 提示词优化风格到推荐技术的映射 */
export const STYLE_TECHNIQUE_MAP: Record<string, readonly string[]> = {
  concise: [
    'few-shot',
    'delimiter-structuring',
    'negative-prompting',
    'constrained-generation',
  ],
  detailed: [
    'chain-of-thought',
    'step-by-step',
    'role-prompting',
    'delimiter-structuring',
    'prompt-chaining',
    'task-decomposition',
  ],
  creative: [
    'role-prompting',
    'tree-of-thought',
    'iterative-refinement',
    'meta-prompting',
    'self-consistency',
  ],
} as const

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/** 根据 ID 获取技术详情 */
export function getTechniqueById(id: string): PromptTechnique | undefined {
  return PROMPT_TECHNIQUES.find((t) => t.id === id)
}

/** 根据优化风格推荐技术 */
export function getTechniquesForStyle(style: string): readonly PromptTechnique[] {
  const techniqueIds = STYLE_TECHNIQUE_MAP[style]
  if (!techniqueIds) return []
  return techniqueIds
    .map((id) => getTechniqueById(id))
    .filter((t): t is PromptTechnique => t !== undefined)
}

/** 根据难度筛选技术 */
export function getTechniquesByDifficulty(
  difficulty: PromptTechnique['difficulty']
): readonly PromptTechnique[] {
  return PROMPT_TECHNIQUES.filter((t) => t.difficulty === difficulty)
}

/** 根据用例搜索技术 */
export function searchTechniquesByUseCase(useCase: string): readonly PromptTechnique[] {
  const lower = useCase.toLowerCase()
  return PROMPT_TECHNIQUES.filter((t) =>
    t.useCases.some((uc) => uc.toLowerCase().includes(lower))
  )
}

/** 获取技术统计信息 */
export function getTechniqueStats() {
  const difficulties = PROMPT_TECHNIQUES.reduce<Record<string, number>>((acc, t) => {
    acc[t.difficulty] = (acc[t.difficulty] || 0) + 1
    return acc
  }, {})

  const allUseCases = new Set<string>()
  for (const t of PROMPT_TECHNIQUES) {
    for (const uc of t.useCases) {
      allUseCases.add(uc)
    }
  }

  return {
    totalTechniques: PROMPT_TECHNIQUES.length,
    byDifficulty: difficulties,
    totalUseCases: allUseCases.size,
    styles: Object.keys(STYLE_TECHNIQUE_MAP),
  }
}
