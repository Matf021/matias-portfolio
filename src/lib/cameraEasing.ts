export function easeInOutQuint(t: number): number {
  const x = Math.max(0, Math.min(1, t));

  return x < 0.5
    ? 16 * x * x * x * x * x
    : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function easeInOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));

  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}