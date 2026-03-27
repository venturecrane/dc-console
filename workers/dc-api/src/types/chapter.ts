export const CHAPTER_STATUSES = ['draft', 'review', 'complete', 'needs-work'] as const
export type ChapterStatus = (typeof CHAPTER_STATUSES)[number]
