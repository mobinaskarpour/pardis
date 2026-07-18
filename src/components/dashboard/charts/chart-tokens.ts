/**
 * Categorical chart palette — brand hues snapped to chromatic steps and
 * validated (lightness band, chroma floor, CVD ΔE, 3:1 contrast) against both
 * the light (#ffffff) and dark (#1c1e21) card surfaces. Assign in fixed order.
 */
export const series = ["#2a5676", "#3d9a9a", "#5558b8", "#b8975c"] as const;

export const chartInk = {
  grid: "var(--border-strong)",
  axis: "var(--text-tertiary)",
  label: "var(--text-secondary)",
  surface: "var(--bg-elevated)",
};
