// =============================================================================
// @deprecated — This module is a backward-compatible re-export layer.
//
// The canonical prompt template system now lives in ./prompt-library.ts.
// All new code should import from './prompt-library' directly.
//
// This file re-exports the legacy API surface so that existing imports
// continue to work without changes. All templates from the original file
// have been merged into prompt-library.ts.
// =============================================================================

export {
  // Canonical types and data
  type PromptCategory,
  type LibraryPrompt,
  PROMPT_LIBRARY,

  // Canonical functions
  getPromptsByCategory,
  searchPromptsByTag,
  searchPrompts,
  getAllCategories,
  getAllTags,
  getPromptById,
  getLibraryStats,

  // Legacy aliases (deprecated)
  type PromptTemplate,
  type TemplateCategory,
  TEMPLATE_CATEGORIES,
  getAllTemplates,
  getTemplatesByCategory,
  searchTemplates,
  getTemplateById,
} from './prompt-library'
