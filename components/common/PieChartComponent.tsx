
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

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#8884d8'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-primary-dark p-2 border border-secondary-dark rounded-md shadow-lg">
                <p className="label text-sm text-light-text">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
    return (
        <div className="bg-secondary-dark p-4 rounded-xl shadow-md h-full flex flex-col text-light-text">
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
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend formatter={(value) => <span className="text-subtle-text">{value}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieChartComponent;
