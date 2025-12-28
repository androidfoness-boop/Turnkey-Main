
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartData {
    name: string;
    value: number;
}

interface PieChartComponentProps {
    data: PieChartData[];
    title: string;
}

const COLORS = ['#FF9500', '#10B981', '#3B82F6', '#EF4444', '#8884d8'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-input p-2 border border-border-dark rounded-md shadow-lg">
                <p className="label text-sm text-text-primary-dark">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
    return (
        <div className="h-full flex flex-col text-text-primary-dark">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent, payload }) => (
                                <text x={payload.x} y={payload.y} fill="#FFFFFF" textAnchor={payload.x > 150 ? 'start' : 'end'} dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            )}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend formatter={(value) => <span className="text-text-secondary-dark">{value}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieChartComponent;
