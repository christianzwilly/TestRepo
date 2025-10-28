// Fixed: Safe handling for empty arrays and no reliance on .at(-1)
function last(arr) {
  return Array.isArray(arr) && arr.length ? arr[arr.length - 1] : undefined;
}

function optimizeParams({ target, initial, recurring, years, r }) {
  const fv = (last(project({ initial, recurring, years, r })) || { value: 0 }).value;
  if (fv >= target) return { kind: 'none' };

  let rc = recurring;
  while (rc <= recurring * 10) {
    rc += Math.max(10, Math.ceil(recurring * 0.05));
    const trial = (last(project({ initial, recurring: rc, years, r })) || { value: 0 }).value;
    if (trial >= target) return { kind: 'recurring', value: rc };
  }

  for (let extra = 1; extra <= 10; extra++) {
    const y = years + extra;
    const trial = (last(project({ initial, recurring, years: y, r })) || { value: 0 }).value;
    if (trial >= target) return { kind: 'tenor', value: y };
  }

  const rcUp = recurring * 1.25;
  for (let extra = 1; extra <= 10; extra++) {
    const y = years + extra;
    const val = (last(project({ initial, recurring: rcUp, years: y, r })) || { value: 0 }).value;
    if (val >= target) return { kind: 'both', recurring: Math.round(rcUp), years: y };
  }

  return { kind: 'impossible' };
}