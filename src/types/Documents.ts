export interface Document {
  id: string
  title: string
  description: string
  tags: string[]
  date: string
  doctor?: string
  hospital?: string
  isPrescription?: boolean
  prescriptionCode?: string
  expirationDays?: number
  usedDate?: string
}

export type DocumentType = 'prescription' | 'report' | 'analysis' | 'visit' | 'diagnostic' | 'other'

export interface DocumentCategory {
  type: DocumentType
  label: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
}

export type PrescriptionStatus = 'valid' | 'expired' | 'used'

export interface BadgeColors {
  color: string
  bgColor: string
  borderColor: string
}

// Tag to color key mapping
export const TAG_COLOR_MAP: Record<string, string> = {
  'cardiologia': 'cardiologia',
  'diabete': 'diabete',
  'endocrinologia': 'endocrinologia',
  'farmaci': 'farmaci',
  'esami': 'esami',
  'analisi': 'analisi',
  'laboratorio': 'laboratorio',
  'oculistica': 'oculistica',
  'ortopedia': 'ortopedia',
  'dermatologia': 'dermatologia',
  'radiologia': 'radiologia',
  'ecografia': 'ecografia',
  'nefrologia': 'nefrologia',
  'vascolare': 'vascolare',
  'riabilitazione': 'riabilitazione',
  'fisioterapia': 'fisioterapia',
  'pediatria': 'pediatria',
  'controllo': 'controllo',
  'neurologia': 'neurologia',
  'pneumologia': 'pneumologia',
  'gastroenterologia': 'gastroenterologia',
  'prescrizione': 'farmaci',
  'visita': 'controllo',
  'diagnostica': 'esami'
}

// Tag to icon mapping
export const TAG_ICON_MAP: Record<string, string> = {
  'cardiologia': '❤️',
  'diabete': '🩸',
  'endocrinologia': '🧬',
  'farmaci': '💊',
  'esami': '🔬',
  'analisi': '🧪',
  'laboratorio': '🧬',
  'oculistica': '👁️',
  'ortopedia': '🦴',
  'dermatologia': '🔬',
  'radiologia': '📷',
  'ecografia': '📡',
  'nefrologia': '🫘',
  'vascolare': '🩸',
  'riabilitazione': '💪',
  'fisioterapia': '🏃',
  'pediatria': '👶',
  'controllo': '✅',
  'neurologia': '🧠',
  'pneumologia': '🫁',
  'gastroenterologia': '🩺',
  'prescrizione': '💊',
  'visita': '👨‍⚕️',
  'diagnostica': '🔬'
}