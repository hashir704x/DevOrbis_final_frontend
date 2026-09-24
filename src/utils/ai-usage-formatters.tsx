function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCost(value: string) {
  const cost = Number(value);

  if (!Number.isFinite(cost)) {
    return "$0.00";
  }

  return `$${cost.toFixed(4)}`;
}

export { formatCost, formatNumber };
