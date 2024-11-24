'use client';
import { useMemo } from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart';
import { Cell, Label, Legend, Pie, PieChart } from 'recharts';
import { useTranslations } from 'next-intl';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const chartConfig = {} satisfies ChartConfig;

function IngredientsChart({ data }: { data: any }) {
  const t = useTranslations();

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
                      {t('ingredients')}
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
