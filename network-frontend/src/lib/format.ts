import { DEFAULT_LOCALE } from '@/config/config';

export function formatNumber(value: number | undefined | null, locale: string = DEFAULT_LOCALE): string {
  if (typeof value !== 'number') return '';
  return value.toLocaleString(locale);
}
