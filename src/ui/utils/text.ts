export const titleCaseLabel = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => (part.length ? `${part[0].toUpperCase()}${part.slice(1)}` : ''))
        .join('-'),
    )
    .join(' ');
