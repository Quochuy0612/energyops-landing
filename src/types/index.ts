// Request types
export interface WorkRequest {
  id: string
  code: string
  title: string
  type: 'maintenance' | 'repair' | 'testing' | 'emergency'
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  requestor: string
  department: string
  equipment: string
  location: string
  scheduledDate: string
  createdAt: string
  description?: string
}

// Operation Ticket types
export interface OperationTicket {
  id: string
  code: string
  title: string
  type: 'disconnect' | 'reconnect' | 'maintenance' | 'testing'
  status: 'draft' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'normal' | 'urgent' | 'critical'
  createdBy: string
  approvedBy?: string
  executedBy?: string
  equipment: Equipment[]
  steps: OperationStep[]
  scheduledStart: string
  scheduledEnd: string
  actualStart?: string
  actualEnd?: string
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface OperationStep {
  id: string
  order: number
  action: string
  equipment: string
  expectedState: string
  actualState?: string
  executedBy?: string
  executedAt?: string
  status: 'pending' | 'completed' | 'skipped'
  notes?: string
}

export interface Equipment {
  id: string
  code: string
  name: string
  type: string
  voltage: string
  location: string
  status: 'active' | 'inactive' | 'maintenance'
}

// Dashboard types
export interface KPIData {
  label: string
  value: number
  unit?: string
  trend?: number
  trendDirection?: 'up' | 'down'
  color?: string
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'dispatcher' | 'operator' | 'viewer'
  department: string
  avatar?: string
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  badge?: number
  children?: NavItem[]
}

// AI Assistant types
export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestions?: string[]
}

// Diagram types for electrical grid builder
export type DiagramNodeType =
  | 'transformer'
  | 'circuitBreaker'
  | 'disconnect'
  | 'groundSwitch'
  | 'busbar'
  | 'powerLine'
  | 'load'
  | 'generator'
  | 'ct'
  | 'fuse'

export interface DiagramNodeData {
  label?: string
  voltage?: string
  state?: 'open' | 'closed'
  onDelete?: (id: string) => void
}

export interface DiagramNode {
  id: string
  type: DiagramNodeType
  position: { x: number; y: number }
  data: DiagramNodeData
  selected?: boolean
}

export interface DiagramEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: 'straight' | 'step' | 'smoothstep'
  selected?: boolean
}
