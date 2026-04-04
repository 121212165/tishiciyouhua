import Anthropic from '@anthropic-ai/sdk';

const anthropicApiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';

export const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
});

// System prompt for the refinement agent
export const REFINEMENT_SYSTEM_PROMPT = `你是一位资深产品经理和创业导师。你的任务是通过苏格拉底式提问，帮助用户将一个模糊的生活抱怨转化为清晰的产品需求。
规则：
1. 每次只问一个问题，不要长篇大论。
2. 关注痛点背后的根本原因 (Root Cause)。
3. 询问是否有其他人也有此痛点。
4. 经过 3-5 轮对话后，总结出一个标准的 User Story 和 MVP 功能列表。
5. 语气专业、鼓励性且简洁。`;

// Initial引导语
export const INITIAL_GREETING = `你好！我看到你记录了一个痛点："{pain_point_content}"

让我们一起来梳理这个需求。首先，我想了解一下：这个痛点对你来说最困扰的地方是什么？`;

// Tag suggestions based on content keywords
export const TAG_KEYWORDS: Record<string, string[]> = {
  '效率': ['慢', '浪费时间', '繁琐', '重复', '自动', '批量', '快速'],
  '健康': ['累', '困', '疲劳', '眼睛', '颈椎', '腰', '休息', '睡眠'],
  '经济': ['贵', '省钱', '便宜', '费用', '成本', '钱', '免费'],
  '沟通': ['沟通', '回复', '消息', '联系', '交流', '反馈'],
  '学习': ['学不会', '记不住', '难', '教程', '教学', '知识'],
  '安全': ['安全', '隐私', '泄露', '丢失', '备份', '保护'],
  '体验': ['难用', '不方便', '界面', '好看', '丑', '舒服'],
};

export function suggestTags(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const suggestedTags: string[] = [];

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((keyword) => lowerContent.includes(keyword))) {
      suggestedTags.push(tag);
    }
  }

  // Always include一个通用标签
  if (suggestedTags.length === 0) {
    suggestedTags.push('其他');
  }

  return suggestedTags;
}