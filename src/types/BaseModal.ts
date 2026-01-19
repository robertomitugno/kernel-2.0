export interface BaseModalProps {
  isOpen: boolean
  title?: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  showFooter?: boolean
  closeOnBackdrop?: boolean
}