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

  if (suggestedTags.length === 0) {
    suggestedTags.push('其他');
  }

  return suggestedTags;
}
