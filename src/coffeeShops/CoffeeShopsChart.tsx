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
import { useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { CoffeeShop } from "./models";

Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type CoffeeShopsChartProps = {
  coffeeShops: CoffeeShop[];
};

export default function CoffeeShopsChart({
  coffeeShops,
}: CoffeeShopsChartProps) {
  const chartRef = useRef<Chart<"scatter">>(null!);
  const [location, setLocation] = useState<Point | null>(null);

  const data = {
    datasets: [allShopsDataset(coffeeShops)],
  };
  if (location) {
    data.datasets.push(locationDataset(location));
  }

  const options = createOptions(onClick);

  function onClick(event: ChartEvent) {
    const point = toChartCoordinates(
      event.x || 0,
      event.y || 0,
      chartRef.current.chartArea
    );

    if (isWithinBounds(point)) {
      setLocation(point);
    }
  }

  return <Scatter options={options} data={data} ref={chartRef} />;
}

type Point = { x: number; y: number };

type DataPoint = { title: string } & Point;

type Dataset = {
  label: string;
  data: DataPoint[];
  borderColor: string;
  backgroundColor: string;
};

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
  return tooltipItems.map((item) => (item.raw as DataPoint).title).join("\n");
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

function isWithinBounds({ x, y }: Point) {
  return -180 <= x && x <= 180 && -90 <= y && y <= 90;
}

function allShopsDataset(coffeeShops: CoffeeShop[]): Dataset {
  return {
    label: "All coffee shops",
    data: coffeeShops.map((coffeeShop) => ({
      title: coffeeShop.name,
      x: coffeeShop.y,
      y: coffeeShop.x,
    })),
    borderColor: "rgba(53, 162, 235, 1)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };
}

function locationDataset({ x, y }: Point): Dataset {
  return {
    label: "Current location",
    data: [
      {
        title: "Current location",
        x,
        y,
      },
    ],
    borderColor: "rgba(53, 235, 162, 1)",
    backgroundColor: "rgba(53, 235, 162, 0.5)",
  };
}
