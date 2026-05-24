// ============================================================
// Prompt Template System
// ============================================================
// Organized templates by category for common use cases.
// ============================================================

export interface PromptTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string
  template: string
  tags: readonly string[]
}

export type TemplateCategory =
  | 'writing'
  | 'programming'
  | 'analysis'
  | 'translation'
  | 'marketing'
  | 'education'

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, string> = {
  writing: '写作',
  programming: '编程',
  analysis: '分析',
  translation: '翻译',
  marketing: '营销',
  education: '教育',
}

// --- Templates ---

const TEMPLATES: readonly PromptTemplate[] = [
  // ===== 写作 =====
  {
    id: 'writing-blog-post',
    name: '博客文章',
    category: 'writing',
    description: '生成结构完整的博客文章，包含标题、正文和结论',
    template: `## 角色
你是一位资深内容创作者，擅长撰写引人入胜的博客文章。

## 任务
撰写一篇关于 [主题] 的博客文章。

## 要求
- 目标读者：[读者群体]
- 文章长度：[字数] 字左右
- 风格基调：[专业/轻松/故事化]
- 包含引人入胜的开头、分段论述和有力的结尾
- 使用小标题、要点列表提升可读性
- 在关键论点处引用数据或案例

## 输出格式
Markdown 格式，包含一级标题、二级标题和正文段落。`,
    tags: ['博客', '文章', '内容创作', 'blog'],
  },
  {
    id: 'writing-product-description',
    name: '产品描述',
    category: 'writing',
    description: '撰写有说服力的产品描述文案，突出卖点和价值',
    template: `## 角色
你是一位资深文案策划师，擅长撰写高转化率的产品描述。

## 任务
为 [产品名称] 撰写产品描述文案。

## 产品信息
- 产品类型：[类型]
- 核心功能：[功能 1, 功能 2, 功能 3]
- 目标用户：[用户画像]
- 使用场景：[场景描述]

## 要求
- 突出 3 个核心卖点，每个卖点用一句话总结 + 详细说明
- 使用 AIDA 模型（注意-兴趣-欲望-行动）
- 包含一个引人注目的产品标语
- 语气：[专业/亲切/高端/活力]

## 输出格式
1. 产品标语（一句话）
2. 核心卖点（3 个，每个含标题和描述）
3. 详细描述（200 字左右）
4. 行动号召（CTA）`,
    tags: ['产品描述', '文案', '营销', 'copywriting'],
  },
  {
    id: 'writing-story',
    name: '故事创作',
    category: 'writing',
    description: '根据设定创作引人入胜的故事',
    template: `## 角色
你是一位有丰富创作经验的叙事作家，善于塑造人物和构建情节。

## 任务
根据以下设定创作一个故事。

## 设定
- 类型：[科幻/奇幻/悬疑/现实/其他]
- 主题：[核心主题]
- 主角：[简要人物设定]
- 背景：[时间和地点]
- 核心冲突：[冲突描述]

## 要求
- 使用「展示而非告知」的写作手法
- 对话自然，符合人物性格
- 节奏张弛有度，高潮迭起
- 结局：[开放式/反转/温暖/留白]

## 输出格式
- 分章节或场景
- 每个场景以环境描写或对话开始`,
    tags: ['故事', '小说', '创意写作', 'fiction'],
  },

  // ===== 编程 =====
  {
    id: 'programming-api',
    name: 'API 设计',
    category: 'programming',
    description: '设计 RESTful API 接口规范',
    template: `## 角色
你是一位资深后端架构师，精通 API 设计最佳实践。

## 任务
为 [业务场景] 设计 RESTful API 接口。

## 资源描述
- 主要资源：[资源名称和描述]
- 关联资源：[相关资源]

## 要求
- 遵循 RESTful 规范
- 包含完整的 HTTP 方法（GET/POST/PUT/DELETE）
- 定义请求参数、请求体和响应格式
- 包含错误码定义和分页方案
- 考虑认证和权限控制

## 输出格式
每个接口包含：
1. HTTP 方法和路径
2. 请求参数/请求体（JSON Schema）
3. 成功响应示例
4. 错误响应及错误码
5. 权限要求`,
    tags: ['API', 'REST', '后端', '接口设计'],
  },
  {
    id: 'programming-code-review',
    name: '代码审查',
    category: 'programming',
    description: '对代码片段进行专业审查，给出改进建议',
    template: `## 角色
你是一位资深代码审查专家，关注代码质量、安全性和可维护性。

## 任务
审查以下代码并给出改进建议。

## 代码
\`\`\`
[在此粘贴代码]
\`\`\`

## 审查维度
请从以下方面进行审查：
1. **正确性**：逻辑是否正确，边界条件是否处理
2. **安全性**：是否存在安全漏洞（注入、XSS、敏感信息泄露等）
3. **性能**：是否有性能瓶颈或可优化之处
4. **可读性**：命名、结构、注释是否清晰
5. **可维护性**：是否遵循 SOLID 原则和 DRY 原则

## 输出格式
- 总体评价（1-2 句话）
- 问题列表（按严重程度排序：严重/中等/建议）
- 每个问题包含：位置、问题描述、修复建议、修复后代码
- 改进后的完整代码`,
    tags: ['代码审查', 'code review', '质量', '安全'],
  },
  {
    id: 'programming-debug',
    name: '调试助手',
    category: 'programming',
    description: '帮助分析和解决代码问题',
    template: `## 角色
你是一位经验丰富的调试专家，善于分析错误信息和定位问题根因。

## 问题描述
[描述你遇到的问题]

## 相关代码
\`\`\`
[粘贴相关代码]
\`\`\`

## 错误信息
\`\`\`
[粘贴错误日志或控制台输出]
\`\`\`

## 已尝试的解决方案
- [方案 1 及结果]
- [方案 2 及结果]

## 环境信息
- 运行环境：[Node.js/浏览器/其他]
- 版本：[版本号]

## 输出格式
1. 问题分析（根因定位）
2. 解决方案（分步骤）
3. 预防措施（如何避免再次发生）`,
    tags: ['调试', 'debug', '排错', '错误修复'],
  },

  // ===== 分析 =====
  {
    id: 'analysis-data',
    name: '数据分析',
    category: 'analysis',
    description: '对数据进行多维度分析并生成报告',
    template: `## 角色
你是一位资深数据分析师，擅长从数据中提取业务洞察。

## 任务
对以下数据进行分析并生成报告。

## 数据说明
[描述数据来源、字段含义、时间范围]

## 分析目标
- [目标 1：例如识别趋势]
- [目标 2：例如找出异常]
- [目标 3：例如提出优化建议]

## 分析维度
1. 趋势分析（时间维度变化）
2. 结构分析（组成和占比）
3. 对比分析（基准比较）
4. 相关性分析（因素关联）

## 输出格式
- 执行摘要（3-5 句话）
- 详细分析（每个维度含数据表格和文字解读）
- 关键发现（3-5 条，按重要性排序）
- 行动建议（具体、可执行、有优先级）`,
    tags: ['数据分析', '报告', '洞察', 'data analysis'],
  },
  {
    id: 'analysis-swot',
    name: 'SWOT 分析',
    category: 'analysis',
    description: '对项目或业务进行 SWOT 战略分析',
    template: `## 角色
你是一位资深商业战略顾问，擅长系统化的竞争分析。

## 任务
对 [分析对象] 进行 SWOT 分析。

## 背景信息
- 行业：[行业]
- 市场地位：[描述]
- 主要竞争对手：[列出]
- 当前挑战：[描述]

## 分析要求
- 每个维度列出 3-5 个要点
- 每个要点包含具体说明和支撑依据
- 基于 SWOT 交叉分析提出战略建议（SO/WO/ST/WT）

## 输出格式
| | 正面 | 负面 |
|---|---|---|
| 内部 | 优势 (S) | 劣势 (W) |
| 外部 | 机会 (O) | 威胁 (T) |

每个维度详细列出后，给出 3-5 条优先级战略建议。`,
    tags: ['SWOT', '战略', '商业分析', 'business'],
  },
  {
    id: 'analysis-competitive',
    name: '竞品分析',
    category: 'analysis',
    description: '对竞品进行全面对比分析',
    template: `## 角色
你是一位资深产品经理，擅长竞品分析和市场定位。

## 任务
对 [产品/服务] 的主要竞品进行对比分析。

## 竞品列表
1. [竞品 A]
2. [竞品 B]
3. [竞品 C]

## 对比维度
- 核心功能
- 定价策略
- 目标用户
- 用户体验
- 技术架构
- 市场策略
- 优势和劣势

## 输出格式
- 功能对比矩阵（表格）
- 各竞品优劣势总结
- 差异化机会点
- 战略建议（3-5 条）`,
    tags: ['竞品分析', '市场分析', 'competitive analysis'],
  },

  // ===== 翻译 =====
  {
    id: 'translation-technical',
    name: '技术文档翻译',
    category: 'translation',
    description: '翻译技术文档，保持术语准确和格式一致',
    template: `## 角色
你是一位精通 [源语言] 和 [目标语言] 的技术文档翻译专家，具备 [相关领域] 的专业背景。

## 任务
将以下技术文档从 [源语言] 翻译为 [目标语言]。

## 原文
[在此粘贴原文]

## 翻译要求
1. **术语一致性**：专业术语保持统一译法，首次出现时附原文
2. **格式保留**：保持原文的标题层级、列表、代码块和链接
3. **语义准确**：宁可直译也不要意译错误
4. **本地化**：计量单位、日期格式按目标语言习惯调整
5. **代码不翻译**：代码块、变量名、API 名称保持原文

## 输出格式
- 翻译正文
- 术语对照表（在文末列出所有专业术语的翻译对照）`,
    tags: ['翻译', '技术文档', 'translation', 'technical'],
  },
  {
    id: 'translation-business',
    name: '商务邮件翻译',
    category: 'translation',
    description: '翻译商务邮件，保持专业语气和文化适配',
    template: `## 角色
你是一位资深商务翻译，精通跨文化商务沟通。

## 任务
将以下商务邮件翻译为 [目标语言]。

## 原文
[在此粘贴邮件原文]

## 背景
- 发件人关系：[客户/合作伙伴/内部同事]
- 邮件目的：[催款/感谢/邀请/通知/其他]
- 正式程度：[正式/半正式/轻松]

## 翻译要求
1. 商务用语地道、专业
2. 根据目标语言文化调整称呼和寒暄方式
3. 保持原文的语气和礼貌程度
4. 数字、日期、货币按目标语言习惯格式化
5. 敬语使用符合目标语言的商务习惯

## 输出格式
翻译完成的邮件正文，可直接发送使用。`,
    tags: ['翻译', '邮件', '商务', 'business translation'],
  },
  {
    id: 'translation-localization',
    name: '产品本地化',
    category: 'translation',
    description: '产品界面文本的本地化翻译',
    template: `## 角色
你是一位产品本地化专家，精通 UI/UX 文案的多语言适配。

## 任务
将以下产品界面文本翻译为 [目标语言]。

## 原文（Key-Value 格式）
[在此粘贴 key=value 格式的文本]

## 产品信息
- 产品类型：[Web 应用/移动应用/桌面应用]
- 目标市场：[国家或地区]
- 品牌调性：[描述]

## 翻译要求
1. 简洁明了，符合界面文案特点
2. 按钮文本控制在 [X] 个字符以内
3. 考虑文本长度对界面布局的影响
4. 文化敏感内容本地化（颜色、图标含义、手势等）
5. 保持一致性：相同功能使用统一译法

## 输出格式
保持 key=value 格式输出翻译结果。`,
    tags: ['本地化', 'UI翻译', 'i18n', 'localization'],
  },

  // ===== 营销 =====
  {
    id: 'marketing-social-media',
    name: '社交媒体内容',
    category: 'marketing',
    description: '生成多平台社交媒体发布内容',
    template: `## 角色
你是一位社交媒体营销专家，精通各平台的内容策略和算法机制。

## 任务
为 [产品/活动/品牌] 生成社交媒体发布内容。

## 信息
- 主题：[核心信息]
- 目标：[品牌曝光/用户互动/转化引流]
- 目标受众：[受众画像]
- 活动/产品链接：[链接]

## 平台要求
请分别为以下平台生成内容：
1. **微博**：140 字以内，带 2-3 个话题标签
2. **小红书**：带标题，使用表情符号分段，带话题标签
3. **LinkedIn**：专业风格，200 字以内，有观点输出
4. **Twitter/X**：280 字符以内，简洁有力

## 输出格式
每个平台单独一段，标注平台名称，可直接复制发布。`,
    tags: ['社交媒体', '营销', '内容', 'social media'],
  },
  {
    id: 'marketing-seo',
    name: 'SEO 内容优化',
    category: 'marketing',
    description: '生成搜索引擎优化的网页内容',
    template: `## 角色
你是一位 SEO 内容策略师，精通搜索引擎算法和内容优化。

## 任务
为 [目标关键词] 优化网页内容。

## 关键词信息
- 主关键词：[主关键词]
- 长尾关键词：[列出 3-5 个]
- 搜索意图：[信息型/交易型/导航型]

## 要求
1. 标题包含主关键词，长度 50-60 字符
2. Meta Description 包含主关键词，150-160 字符
3. H1-H3 标题结构合理，自然包含关键词
4. 内容长度 1500-2000 字
5. 关键词密度 1-2%，自然分布
6. 包含内部链接建议位置
7. 包含图片 Alt 文本建议

## 输出格式
1. SEO 标题
2. Meta Description
3. 内容大纲（H2/H3 结构）
4. 完整正文
5. 关键词分布建议`,
    tags: ['SEO', '搜索引擎', '内容营销', '优化'],
  },
  {
    id: 'marketing-email-campaign',
    name: '邮件营销',
    category: 'marketing',
    description: '设计邮件营销活动的内容模板',
    template: `## 角色
你是一位邮件营销专家，擅长撰写高打开率和高转化率的邮件内容。

## 任务
为 [活动名称/目的] 设计邮件营销内容。

## 活动信息
- 产品/服务：[描述]
- 目标受众：[受众画像]
- 邮件目的：[促销/通知/激活/留存]
- 核心价值点：[列出]

## 要求
1. 邮件主题行：提供 3 个备选（40 字符以内，含 A/B 测试建议）
2. 预览文本：30-40 字符
3. 正文结构：标题 -> 痛点共鸣 -> 解决方案 -> 行动号召
4. CTA 按钮文案：2-3 个备选
5. 语气亲切但专业

## 输出格式
- 3 个邮件主题行备选
- 预览文本
- 邮件正文（HTML 友好的结构描述）
- CTA 方案`,
    tags: ['邮件营销', 'EDM', '转化率', 'email marketing'],
  },

  // ===== 教育 =====
  {
    id: 'education-lesson-plan',
    name: '课程设计',
    category: 'education',
    description: '设计结构化的教学课程计划',
    template: `## 角色
你是一位资深教育设计专家，精通教学方法论和课程设计。

## 任务
为 [主题] 设计一节 [时长] 的课程计划。

## 学习者信息
- 目标学员：[年龄段/知识水平]
- 先修知识：[需要哪些前置知识]
- 学习目标：[学员完成后应掌握什么]

## 课程设计要求
1. 导入环节（5-10 分钟）：引人入胜的开场
2. 知识讲解（核心时段）：循序渐进，由浅入深
3. 互动练习：至少 2 个练习或讨论环节
4. 总结回顾：关键要点回顾
5. 课后作业：巩固练习

## 输出格式
- 课程标题和目标
- 时间安排（精确到分钟）
- 每个环节的教学活动描述
- 所需教具/材料清单
- 评估方式`,
    tags: ['课程设计', '教学', '教育', 'lesson plan'],
  },
  {
    id: 'education-explanation',
    name: '概念讲解',
    category: 'education',
    description: '将复杂概念用易懂的方式解释',
    template: `## 角色
你是一位善于将复杂概念简单化的教育者，擅长使用类比和可视化讲解。

## 任务
解释 [概念名称] 这个概念。

## 受众
- 知识水平：[小白/中级/专业]
- 背景领域：[相关领域]

## 讲解要求
1. 先用一句话概括核心含义
2. 使用一个贴切的日常类比
3. 分层次讲解（基础理解 -> 深入原理 -> 实际应用）
4. 列举 2-3 个生活或工作中的实际例子
5. 澄清常见误解
6. 提供进一步学习方向

## 输出格式
- 一句话定义
- 类比说明
- 分层讲解
- 实例
- 常见误解
- 学习资源建议`,
    tags: ['概念解释', '教育', '讲解', 'explanation'],
  },
  {
    id: 'education-quiz',
    name: '测验生成',
    category: 'education',
    description: '根据主题自动生成测验题目',
    template: `## 角色
你是一位专业的教育测评设计师，精通布鲁姆分类法和题目设计。

## 任务
为 [主题] 生成一套测验题。

## 测验信息
- 题目数量：[数量]
- 难度分布：[简单 30% / 中等 50% / 困难 20%]
- 目标学员：[描述]
- 考查范围：[知识点列表]

## 题型要求
1. 选择题（含 4 个选项，标注正确答案和解析）
2. 判断题（含解析）
3. 简答题（含参考答案和评分要点）
4. 应用题/案例分析题（含评分标准）

## 输出格式
- 按难度排序
- 每题包含：题目、选项/作答要求、正确答案、解析
- 附上知识点对照表
- 建议及格分数线`,
    tags: ['测验', '考试', '题目生成', 'quiz'],
  },
] as const

// --- Exported Functions ---

/**
 * 获取所有模板
 */
export function getAllTemplates(): readonly PromptTemplate[] {
  return TEMPLATES
}

/**
 * 按类别获取模板
 */
export function getTemplatesByCategory(category: TemplateCategory): readonly PromptTemplate[] {
  return TEMPLATES.filter((t) => t.category === category)
}

/**
 * 搜索模板（按名称、描述和标签模糊匹配）
 */
export function searchTemplates(query: string): readonly PromptTemplate[] {
  const lowerQuery = query.toLowerCase().trim()
  if (lowerQuery.length === 0) return TEMPLATES

  return TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * 根据 ID 获取模板
 */
export function getTemplateById(id: string): PromptTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id)
}
