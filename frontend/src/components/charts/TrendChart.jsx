import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AXIS_TICK = { fill: '#101B32', fontSize: 12 };
const TOOLTIP_STYLE = { borderRadius: 12, borderColor: '#E0E7F2' };

export function TrendChart({ data, series, xKey = 'label', yDomain, yFormatter, className }) {
    const gradientPrefix = useId().replace(/:/g, '');

    return (
        <div className={className}>
            {series.length > 1 && (
                <ul className="mb-3 flex flex-wrap justify-center gap-4 text-sm font-medium text-ink">
                    {series.map((item) => (
                        <li key={item.key} className="flex items-center gap-2">
                            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <defs>
                            {series.map((item) => (
                                <linearGradient key={item.key} id={`${gradientPrefix}-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={item.color} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={item.color} stopOpacity={0.02} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid vertical={false} stroke="#E0E7F2" />
                        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS_TICK} />
                        <YAxis
                            domain={yDomain}
                            tickFormatter={yFormatter}
                            tickLine={false}
                            axisLine={false}
                            width={48}
                            tick={AXIS_TICK}
                        />
                        <Tooltip
                            contentStyle={TOOLTIP_STYLE}
                            formatter={(value, name) => [yFormatter ? yFormatter(value) : value, name]}
                        />
                        {series.map((item) => (
                            <Area
                                key={item.key}
                                type="monotone"
                                dataKey={item.key}
                                name={item.label}
                                stroke={item.color}
                                strokeWidth={2.5}
                                fill={`url(#${gradientPrefix}-${item.key})`}
                                dot={{ r: 4, fill: '#FFFFFF', stroke: item.color, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}