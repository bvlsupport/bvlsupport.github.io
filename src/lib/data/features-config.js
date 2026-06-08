export const ICON_PATHS = {
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  brain: 'M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l2 3h6l2-3c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z M12 2v20 M8 12h8',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
};

function titleCase(value = '') {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeFeaturesConfig(raw) {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  const rawSections = Array.isArray(raw?.sections) ? raw.sections : [];

  const sectionMap = new Map();

  for (const sec of rawSections) {
    if (!sec?.id) continue;
    sectionMap.set(sec.id, {
      id: sec.id,
      label: sec.label || titleCase(sec.id),
      icon: sec.icon || 'tool'
    });
  }

  for (const item of items) {
    if (!item?.section) continue;
    if (!sectionMap.has(item.section)) {
      sectionMap.set(item.section, {
        id: item.section,
        label: titleCase(item.section),
        icon: 'tool'
      });
    }
  }

  const sections = [...sectionMap.values()];

  const normalizedItems = items
    .filter((item) => item?.id && item?.name && item?.section)
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      url: item.url || '#',
      section: item.section,
      status: item.status || 'coming-soon',
      icon: item.icon || 'tool',
      newTab: typeof item.newTab === 'boolean' ? item.newTab : true
    }));

  return { sections, items: normalizedItems };
}
