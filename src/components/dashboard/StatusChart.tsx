// ============================================
// Status Chart Component (Donut)
// ============================================

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader } from '../ui';
import type { MemberStatus } from '../../lib/types';

interface StatusData {
    name: MemberStatus;
    value: number;
    color: string;
}

interface StatusChartProps {
    data: StatusData[];
}

const COLORS: Record<MemberStatus, string> = {
    Active: '#10b981',
    Probation: '#f59e0b',
    Passive: '#52525b',
    Dismissed: '#ef4444',
};

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="h-full">
            <CardHeader title="Member Status" subtitle="Distribution by status" />

            <div className="flex items-center gap-6">
                {/* Chart */}
                <div className="w-40 h-40 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#18181b',
                                    border: '1px solid #27272a',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                }}
                                itemStyle={{ color: '#f4f4f5' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[item.name] }}
                                />
                                <span className="text-sm text-text-muted">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-mono text-text-primary">{item.value}</span>
                                <span className="text-xs text-text-dim ml-2">
                                    ({Math.round((item.value / total) * 100)}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
