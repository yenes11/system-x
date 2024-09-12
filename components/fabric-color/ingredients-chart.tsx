'use client';
import { useMemo } from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart';
import { Cell, Label, Legend, Pie, PieChart } from 'recharts';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 190, fill: 'var(--color-other)' }
];

const chartConfig = {} satisfies ChartConfig;

function IngredientsChart({ data }: { data: any }) {
  const _chartData = useMemo(() => {
    return data.reduce((acc: any[], curr: any) => {
      acc.push({
        name: curr.name,
        percentage: curr.percentage,
        fill: 'var(--color-Poliester)'
      });
      return acc; // Return the accumulator
    }, [] as any[]);
  }, [data]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-60">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Legend
          formatter={(value, entry, index) => {
            const item = data[index];
            return `${item.name} ${item.percentage}%`;
          }}
        />

        <Pie
          data={data}
          dataKey="percentage"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-lg font-bold"
                    >
                      Ingredients
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export default IngredientsChart;
