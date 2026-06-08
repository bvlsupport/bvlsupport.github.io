# BVL Support Homepage

This homepage is fully data-driven from:

- `src/lib/data/features.json`

The UI automatically builds:

- top sections/tabs
- cards per section
- search filtering
- theme options (dark/light)

## Features JSON schema

The file uses JSON Schema validation:

- `src/lib/data/features.schema.json`

`features.json` includes:

```json
{
  "$schema": "./features.schema.json",
  "theme": {
    "default": "dark",
    "options": ["dark", "light"]
  },
  "sections": [
    { "id": "tools", "label": "Tools", "icon": "tool" }
  ],
  "items": [
    {
      "id": "trigger2marker",
      "name": "TRIGGER2MARKER",
      "description": "...",
      "tags": ["trigger", "marker"],
      "url": "https://example.com",
      "section": "tools",
      "status": "published",
      "icon": "activity",
      "newTab": true
    }
  ]
}
```

## Status values

Allowed `status` values:

- `published`
- `coming-soon`

Any unsupported value is treated as `coming-soon` at runtime.

## Icon system (Material icons via Iconify)

Icons are rendered with `@iconify/svelte`.

Use either:

1. **Alias keys** (easy, recommended):
- `tool`
- `chart`
- `file`
- `monitor`
- `activity`
- `brain`
- `zap`

2. **Any Iconify icon name** (full control), for example:
- `material-symbols:bolt-rounded`
- `material-symbols:neurology-rounded`
- `mdi:test-tube`

Aliases are defined in:

- `src/lib/data/features-config.js`

To add more aliases, update `ICON_ALIASES` in that file.

## Add a new section

1. Add a section object in `sections`.
2. Add items with matching `section` id.

No page code change is needed.

## Add a new card

Add one object to `items` with at least:

- `id`
- `name`
- `section`
- `status`
- `icon`

Optional:

- `description`
- `tags`
- `url`
- `newTab`

## Development

```bash
npm install
npm run dev
```
