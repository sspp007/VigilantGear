export const DAILY_STATS = [
    { date: '2025-01-20', compliant: 215, uncertain: 30, violations: { helmet: 26, safety_vest: 22, goggles: 8, gloves: 4, others: 2 } },
    { date: '2025-01-21', compliant: 267, uncertain: 32, violations: { helmet: 30, safety_vest: 26, goggles: 8, gloves: 4, others: 4 } },
    { date: '2025-01-22', compliant: 369, uncertain: 38, violations: { helmet: 36, safety_vest: 30, goggles: 10, gloves: 5, others: 4 } },
    { date: '2025-01-23', compliant: 329, uncertain: 34, violations: { helmet: 29, safety_vest: 25, goggles: 8, gloves: 5, others: 3 } },
    { date: '2025-01-24', compliant: 395, uncertain: 36, violations: { helmet: 34, safety_vest: 29, goggles: 9, gloves: 6, others: 4 } },
    { date: '2025-01-25', compliant: 538, uncertain: 38, violations: { helmet: 44, safety_vest: 38, goggles: 12, gloves: 6, others: 5 } },
    { date: '2025-01-26', compliant: 851, uncertain: 47, violations: { helmet: 63, safety_vest: 54, goggles: 20, gloves: 7, others: 3 } },
];

export const LATEST_STATS_DATE = DAILY_STATS[DAILY_STATS.length - 1].date;