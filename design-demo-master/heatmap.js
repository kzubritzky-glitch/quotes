document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("heatmapChart");
  const errEl = document.getElementById("heatmapError");
  /** Sun–Sat columns; y-axis shows Mon, Wed, Fri like the Figma mock */
  const Y_AXIS_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

  function formatTooltipDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function render(data) {
    const { weeks, month_labels, summary } = data;

    document.getElementById("heatmapTotalActivities").textContent = String(
      summary.total_activities ?? 0,
    );
    document.getElementById("heatmapActiveDays").textContent = String(summary.active_days ?? 0);
    document.getElementById("heatmapPeakActivity").textContent = String(summary.peak_activity ?? 0);

    mount.textContent = "";
    mount.style.setProperty("--heatmap-week-count", String(weeks.length));

    const scroll = document.createElement("div");
    scroll.className = "heatmap-chart-scroll";

    const headRow = document.createElement("div");
    headRow.className = "heatmap-head";
    const spacer = document.createElement("div");
    spacer.className = "heatmap-y-spacer";
    spacer.setAttribute("aria-hidden", "true");
    const months = document.createElement("div");
    months.className = "heatmap-months";

    for (let i = 0; i < weeks.length; i++) {
      const ml = month_labels.find((m) => m.column === i);
      const cell = document.createElement("div");
      cell.className = "heatmap-month-cell";
      if (ml) cell.textContent = ml.month;
      months.appendChild(cell);
    }
    headRow.appendChild(spacer);
    headRow.appendChild(months);

    const body = document.createElement("div");
    body.className = "heatmap-body";

    const yAxis = document.createElement("div");
    yAxis.className = "heatmap-y-axis";
    yAxis.setAttribute("aria-hidden", "true");
    for (let r = 0; r < 7; r++) {
      const tick = document.createElement("div");
      tick.className = "heatmap-y-tick";
      tick.textContent = Y_AXIS_LABELS[r];
      yAxis.appendChild(tick);
    }

    const grid = document.createElement("div");
    grid.className = "heatmap-weeks";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "Daily task completions by week");

    for (const week of weeks) {
      const col = document.createElement("div");
      col.className = "heatmap-week-col";
      col.setAttribute("role", "row");
      for (const day of week.days) {
        const cell = document.createElement("button");
        cell.type = "button";
        const level = Math.min(Math.max(day.level, 0), 4);
        cell.className = `heatmap-cell heatmap-cell--level-${level}`;
        const noun = day.count === 1 ? "task" : "tasks";
        const tip = `${formatTooltipDate(day.date)} · ${day.count} ${noun} completed`;
        cell.title = tip;
        cell.setAttribute("aria-label", tip);
        col.appendChild(cell);
      }
      grid.appendChild(col);
    }

    body.appendChild(yAxis);
    body.appendChild(grid);

    const legendRow = document.createElement("div");
    legendRow.className = "heatmap-legend-row";
    const hint = document.createElement("span");
    hint.className = "heatmap-hint";
    hint.textContent = "Hover over a cell to see details";
    const legend = document.createElement("div");
    legend.className = "heatmap-legend";
    const less = document.createElement("span");
    less.className = "heatmap-legend-cap";
    less.textContent = "Less";
    const more = document.createElement("span");
    more.className = "heatmap-legend-cap";
    more.textContent = "More";
    const swatches = document.createElement("div");
    swatches.className = "heatmap-legend-swatches";
    for (let lv = 0; lv <= 4; lv++) {
      const s = document.createElement("span");
      s.className = `heatmap-cell heatmap-cell--level-${lv} heatmap-legend-swatch`;
      s.setAttribute("aria-hidden", "true");
      swatches.appendChild(s);
    }
    legend.appendChild(less);
    legend.appendChild(swatches);
    legend.appendChild(more);
    legendRow.appendChild(hint);
    legendRow.appendChild(legend);

    scroll.appendChild(headRow);
    scroll.appendChild(body);
    scroll.appendChild(legendRow);
    mount.appendChild(scroll);
  }

  async function load() {
    try {
      errEl.hidden = true;
      const res = await fetch("/api/analytics/heatmap");
      if (!res.ok) throw new Error(res.statusText);
      render(await res.json());
    } catch (e) {
      console.error(e);
      errEl.hidden = false;
      errEl.textContent = "Could not load heatmap data. Refresh to try again.";
    }
  }

  load();
});
