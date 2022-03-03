import {
  Chart,
  ChartArea,
  ChartEvent,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useRef } from "react";
import { Scatter } from "react-chartjs-2";
import { CoffeeShop } from "./models";

Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type CoffeeShopsChartProps = {
  coffeeShops: CoffeeShop[];
};

export default function CoffeeShopsChart({
  coffeeShops,
}: CoffeeShopsChartProps) {
  const options = createOptions(onClick);
  const data = createData(coffeeShops);
  const chartRef = useRef<Chart<"scatter">>(null!);

  function onClick(event: ChartEvent) {
    const { x, y } = toChartCoordinates(
      event.x || 0,
      event.y || 0,
      chartRef.current.chartArea
    );

    if (isPointWithinBounds(x, y)) {
      const data = [
        {
          name: "Current location",
          x,
          y,
        },
      ];
    }
  }

  return <Scatter options={options} data={data} ref={chartRef} />;
}

function createOptions(onClick: (event: ChartEvent) => void) {
  return {
    scales: {
      x: {
        min: -180,
        max: 180,
        position: "top" as "top",
      },
      y: {
        min: -90,
        max: 90,
      },
    },
    elements: {
      point: {
        radius: 15,
        hoverRadius: 20,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: tooltipTitle,
        },
      },
    },
    onClick: onClick,
  };
}

function tooltipTitle(tooltipItems: TooltipItem<"scatter">[]) {
  return tooltipItems.map((item) => (item.raw as CoffeeShop).name).join("\n");
}

function toChartCoordinates(
  canvasX: number,
  canvasY: number,
  chartArea: ChartArea
) {
  const x =
    Math.round(
      (((canvasX - chartArea.left) / chartArea.width) * 360 - 180) * 10
    ) / 10;

  const y =
    Math.round(
      (90 - ((canvasY - chartArea.top) / chartArea.height) * 180) * 10
    ) / 10;

  return { x, y };
}

function isPointWithinBounds(x: number, y: number) {
  return -180 <= x && x <= 180 && -90 <= y && y <= 90;
}

function createData(coffeeShops: CoffeeShop[]) {
  return {
    datasets: [
      {
        label: "All Blue Bottle Coffee Shops",
        data: coffeeShops.map((coffeeShop) => ({
          name: coffeeShop.name,
          x: coffeeShop.y,
          y: coffeeShop.x,
        })),
        borderColor: "rgba(53, 162, 235, 1)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
}
