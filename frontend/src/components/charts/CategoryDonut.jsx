import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';

export function CategoryDonut({ categories, total, className }) {
    if (total === 0) {
        return <EmptyState title="No violations" description="No violations were recorded in this period." />;
    }

    return (
        <div className={cn('flex flex-col items-center gap-6 sm:flex-row sm:justify-center', className)}>
            <div className="relative h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categories}
                            dataKey="count"
                            nameKey="label"
                            innerRadius="68%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={1}
                            stroke="none"
                        >
                            {categories.map((category) => (
                                <Cell key={category.id} fill={category.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-ink">{formatNumber(total)}</span>
                    <span className="text-sm font-semibold text-ink">Violations</span>
                </div>
            </div>

            <ul className="space-y-2.5">
                {categories.map((category) => (
                    <li key={category.id} className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                        <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full"
                            style={{ backgroundColor: category.color }}
                            aria-hidden="true"
                        />
                        {`${category.label} (${category.percent}%)`}
                    </li>
                ))}
            </ul>
        </div>
    );
}