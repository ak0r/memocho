type DateVariant = 'archive' | 'post' | 'seo';

export function formatDate(date: Date, variant: DateVariant): string {
  switch (variant) {
    case 'archive':
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
      }).format(date);

    case 'post':
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);

    case 'seo':
      return date.toISOString().split('T')[0]; // YYYY-MM-DD

    default:
      return '';
  }
}