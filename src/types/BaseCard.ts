import type { FunctionalComponent } from 'vue'

export interface CardMetadata {
  icon: FunctionalComponent
  label: string
}

export interface BaseCardProps {
  title: string
  description: string
  icon: FunctionalComponent
  metadata: CardMetadata[]
  selected?: boolean
}