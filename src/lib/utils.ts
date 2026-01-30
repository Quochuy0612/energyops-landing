import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'warning',
    'in_progress': 'info',
    'approved': 'success',
    'completed': 'success',
    'rejected': 'error',
    'cancelled': 'neutral',
    'draft': 'neutral',
  }
  return statusMap[status.toLowerCase()] || 'neutral'
}

export function getStatusLabel(status: string): string {
  const labelMap: Record<string, string> = {
    'pending': 'Chờ duyệt',
    'in_progress': 'Đang xử lý',
    'approved': 'Đã duyệt',
    'completed': 'Hoàn thành',
    'rejected': 'Từ chối',
    'cancelled': 'Đã hủy',
    'draft': 'Nháp',
  }
  return labelMap[status.toLowerCase()] || status
}
