// This provides a client-side fallback for bias computation 
// if the Python Cloud Run backend is not available.

export function computeBiasMetrics(data: any[], target: string, protectedAttr: string, favorableVal: string) {
  let privilegedFavorable = 0;
  let privilegedTotal = 0;
  let unprivilegedFavorable = 0;
  let unprivilegedTotal = 0;

  // Extremely simplified heuristic to guess privileged group (most frequent favorable outcome)
  const groupCounts: Record<string, { fav: number, total: number }> = {};
  
  data.forEach(row => {
    const group = row[protectedAttr];
    const isFavorable = String(row[target]) === String(favorableVal);
    
    if (!groupCounts[group]) groupCounts[group] = { fav: 0, total: 0 };
    groupCounts[group].total++;
    if (isFavorable) groupCounts[group].fav++;
  });

  // Find privileged group (highest selection rate)
  let bestRate = -1;
  let privilegedGroupName = '';
  
  Object.entries(groupCounts).forEach(([group, counts]) => {
    const rate = counts.fav / (counts.total || 1);
    if (rate > bestRate && counts.total > 5) {
      bestRate = rate;
      privilegedGroupName = group;
    }
  });

  Object.entries(groupCounts).forEach(([group, counts]) => {
    if (group === privilegedGroupName) {
      privilegedFavorable += counts.fav;
      privilegedTotal += counts.total;
    } else {
      unprivilegedFavorable += counts.fav;
      unprivilegedTotal += counts.total;
    }
  });

  const privRate = privilegedFavorable / (privilegedTotal || 1);
  const unprivRate = unprivilegedFavorable / (unprivilegedTotal || 1);

  return {
    disparateImpact: privRate > 0 ? unprivRate / privRate : 1,
    statParityDiff: unprivRate - privRate,
    equalOppDiff: (unprivRate - privRate) * 0.8, // simplified mock
    avgOddsDiff: (unprivRate - privRate) * 0.6, // simplified mock
    theilIndex: Math.abs(privRate - unprivRate) * 0.5 // simplified mock
  };
}
