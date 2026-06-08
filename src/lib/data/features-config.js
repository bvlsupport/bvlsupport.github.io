export const ICON_ALIASES = {
  tool: 'material-symbols:build-rounded',
  chart: 'material-symbols:bar-chart-rounded',
  file: 'material-symbols:description-rounded',
  monitor: 'material-symbols:desktop-windows-rounded',
  activity: 'material-symbols:monitor-heart-rounded',
  brain: 'material-symbols:neurology-rounded',
  zap: 'material-symbols:bolt-rounded'
};

export const AVAILABLE_THEMES = ['dark', 'light'];
export const AVAILABLE_STATUSES = ['published', 'coming-soon'];

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
      status: AVAILABLE_STATUSES.includes(item.status) ? item.status : 'coming-soon',
      icon: item.icon || 'tool',
      newTab: typeof item.newTab === 'boolean' ? item.newTab : true
    }));

  return { sections, items: normalizedItems };
}

export function resolveIconName(icon) {
  if (!icon) return ICON_ALIASES.tool;
  if (icon.includes(':')) return icon;
  return ICON_ALIASES[icon] || ICON_ALIASES.tool;
}

export function normalizeThemeConfig(raw) {
  const cfg = raw?.theme || {};
  const options = Array.isArray(cfg.options)
    ? cfg.options.filter((theme) => AVAILABLE_THEMES.includes(theme))
    : ['dark', 'light'];

  const uniqueOptions = [...new Set(options.length ? options : ['dark', 'light'])];
  const defaultTheme = AVAILABLE_THEMES.includes(cfg.default) ? cfg.default : uniqueOptions[0];

  return {
    defaultTheme,
    options: uniqueOptions
  };
}
