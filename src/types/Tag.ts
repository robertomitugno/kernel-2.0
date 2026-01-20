export interface Tag {
  id: string
  label: string
  count?: number
}

export interface TagBarProps {
  tags: Tag[]
  selectedTag?: string
  multiple?: boolean
  activeTags?: string[]
}
