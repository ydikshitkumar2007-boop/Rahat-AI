import { RiskLevel, StationStatus } from '@/types';

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'N/A';
  const now = new Date().getTime();
  const past = new Date(dateString).getTime();
  const diffMinutes = Math.floor((now - past) / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function getRiskBadgeStyle(level: RiskLevel) {
  switch (level) {
    case 'severe':
      return 'bg-[#A33D32]/15 text-[#A33D32] dark:text-[#F87171] border-[#A33D32]/40';
    case 'high':
      return 'bg-[#B7602B]/15 text-[#B7602B] dark:text-[#FB923C] border-[#B7602B]/40';
    case 'moderate':
      return 'bg-[#B88422]/15 text-[#B88422] dark:text-[#FBBF24] border-[#B88422]/40';
    case 'low':
    default:
      return 'bg-[#4F7A58]/15 text-[#4F7A58] dark:text-[#4ADE80] border-[#4F7A58]/40';
  }
}

export function getStationStatusStyle(status: StationStatus) {
  switch (status) {
    case 'online':
      return 'text-[#4F7A58] dark:text-[#4ADE80] bg-[#4F7A58]/10 border-[#4F7A58]/30';
    case 'degraded':
      return 'text-[#B88422] dark:text-[#FBBF24] bg-[#B88422]/10 border-[#B88422]/30';
    case 'maintenance':
      return 'text-[#667C8F] dark:text-[#94A3B8] bg-[#667C8F]/10 border-[#667C8F]/30';
    case 'offline':
    default:
      return 'text-[#A33D32] dark:text-[#F87171] bg-[#A33D32]/10 border-[#A33D32]/30';
  }
}
