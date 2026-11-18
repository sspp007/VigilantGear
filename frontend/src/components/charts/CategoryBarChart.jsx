import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils/cn';

const AXIS_TICK = { fill: '#101B32', fontSize: 12 };
const LABEL_STYLE = { fill: '#7F1D1D', fontWeight: 700, fontSize: 14 };
const TOOLTIP_STYLE = { borderRadius: 12, borderColor: '#E0E7F2' };

export function CategoryBarChart({ categories, className }) {
    const description = categories.map((category) => `${category.label}: ${category.count}`).join(', ');

    return (
        <div role="img" aria-label={`Violations by category. ${description}`} className={cn('h-72 w-full', className)}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#E0E7F2" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} interval={0} />
                    <YAxis tickLine={false} axisLine={false} width={40} tick={AXIS_TICK} allowDecimals={false} />
                    <Tooltip cursor={{ fill: '#F5F7FC' }} contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" name="Violations" radius={[8, 8, 0, 0]} maxBarSize={72}>
                        {categories.map((category) => (
                            <Cell key={category.id} fill={category.color} />
                        ))}
                        <LabelList dataKey="count" position="top" style={LABEL_STYLE} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}