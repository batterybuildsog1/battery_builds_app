import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LoadData {
  room: string;
  heating: number;
  cooling: number;
}

interface LoadChartProps {
  data: LoadData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-2">{label}</h3>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-[#2A5C7D] mr-2"></span>
          Heating: {payload[0].value.toLocaleString()} BTU/hr
        </p>
        <p className="text-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-[#7EA8BE] mr-2"></span>
          Cooling: {payload[1].value.toLocaleString()} BTU/hr
        </p>
      </div>
    </div>
  );
};

export const LoadChart: React.FC<LoadChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="room"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: 'BTU/hr',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
          />
          <Bar
            dataKey="heating"
            name="Heating"
            fill="#2A5C7D"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="cooling"
            name="Cooling"
            fill="#7EA8BE"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadChart;