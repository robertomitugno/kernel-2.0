export interface Toast {
  message: string
  show: boolean
  duration?: number
  type?: 'success' | 'error' | 'info' | 'warning'
}
