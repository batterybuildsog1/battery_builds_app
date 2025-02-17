import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Theme } from '@nivo/core';

interface HeatLoadDataPoint {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

interface HeatLoadChartProps {
  data: HeatLoadDataPoint[];
  width?: number;
  height?: number;
  isLoading?: boolean;
}

const theme: Theme = {
  background: 'transparent',
  textColor: '#333333',
  fontSize: 12,
  axis: {
    domain: {
      line: {
        stroke: '#777777',
        strokeWidth: 1
      }
    },
    ticks: {
      line: {
        stroke: '#777777',
        strokeWidth: 1
      }
    }
  },
  grid: {
    line: {
      stroke: '#dddddd',
      strokeWidth: 1
    }
  }
};

const HeatLoadChart: React.FC<HeatLoadChartProps> = ({
  data,
  width = 800,
  height = 400,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div style={{ width, height }} className="relative">
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=">-.2s"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: '',
          legendOffset: 46
        }}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: '',
          legendPosition: 'middle',
          legendOffset: 46
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Categories',
          legendPosition: 'middle',
          legendOffset: -72
        }}
        colors={{
          type: 'sequential',
          scheme: 'blues'
        }}
        emptyColor="#ffffff"
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.4]]
        }}
        borderWidth={1}
        borderRadius={0}
        enableLabels={true}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 2]]
        }}
        annotations={[]}
        theme={theme}
        tooltip={({ xKey, yKey, value }) => (
          <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
            <strong className="block text-sm text-gray-700">{`${xKey} - ${yKey}`}</strong>
            <span className="text-sm text-gray-600">{`Value: ${value}`}</span>
          </div>
        )}
      />
    </div>
  );
};

export default HeatLoadChart;