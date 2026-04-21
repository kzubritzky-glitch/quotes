# Implementation Plan: KAN-146 Add activity heatmap

## Scope

- In scope: New `/heatmap` page, top navigation entry, client rendering from existing `GET /api/analytics/heatmap`, GitHub-style grid (12 weeks, Mon–Sun rows), accent-based intensity, tooltips, streak + total summary stats, layout aligned with Figma (rounded white card, circular cells, Less/More legend, hover hint).
- Out of scope: External chart libraries; 365-day grid (ticket specifies 12 weeks; subtitle reflects that).

## Design Reference

- [Activity Heatmap (Figma)](https://www.figma.com/design/WWmnpGwUsLQ4XqK4bIeRPO/Activity-Heatmap?node-id=2-4) — circular cells, legend row, card chrome and typography hierarchy. Heat colors follow Jira AC (`--accent` with opacity), not the Figma placeholder greens.

## Approach

- Reuse existing Flask endpoint and `_build_heatmap_grid` / `_heatmap_summary`.
- Add `heatmap.html` + `heatmap.js` (vanilla DOM, no Chart.js).
- Extend `styles.css` with heatmap tokens and layout; reuse KPI card patterns.
- Link **Activity** in `index.html` and `analytics.html` nav.

## File Changes

- `heatmap.html` — page shell, mount points, script include.
- `heatmap.js` — fetch API, render month header, Y labels, week columns, legend, fill KPIs.
- `styles.css` — heatmap layout, cell levels, feature card, responsive tweaks.
- `index.html`, `analytics.html` — nav link to `/heatmap`.
- `tests/test_app.py` — route and API shape tests.

## Steps

1. Add HTML/JS/CSS for heatmap UI.
2. Wire navigation on all top-level pages.
3. Add tests; run pytest.

## Edge Cases

- Empty database: grid shows all level-0 cells; streaks zero.
- Narrow viewports: horizontal scroll for week columns.

## Test Plan

- [x] `pytest` for `/heatmap` and `/api/analytics/heatmap`
- [ ] Manual: hover tooltips, nav between Tasks / Analytics / Activity

## Risks

- None significant; API already implemented.

## Notion

Notion MCP was not available in this environment; this file serves as the published plan artifact.
