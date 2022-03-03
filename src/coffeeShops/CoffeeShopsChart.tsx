import {
  Chart,
  ChartEvent,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { CoffeeShop } from "./models";
import { sortByDistance } from "./sorting";

Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type CoffeeShopsChartProps = {
  coffeeShops: CoffeeShop[];
};

export default function CoffeeShopsChart({
  coffeeShops,
}: CoffeeShopsChartProps) {
  const chartRef = useRef<Chart<"scatter">>(null!);
  const [location, setLocation] = useState<Point | null>(null);

  const [closestShops, setClosestShops] = useState<CoffeeShop[]>([]);
  const [otherShops, setOtherShops] = useState<CoffeeShop[]>([]);

  useEffect(() => {
    const closest = location
      ? sortByDistance(location, coffeeShops).slice(undefined, 3)
      : [];
    setClosestShops(closest);

    const closestIds = closest.map((coffeeShop) => coffeeShop.id);
    const other = coffeeShops.filter(
      (coffeeShop) => !closestIds.includes(coffeeShop.id)
    );
    setOtherShops(other);
  }, [location, coffeeShops]);

  const data = {
    datasets: location
      ? [
          locationDataset(location),
          closestShopsDataset(closestShops),
          otherShopsDataset(otherShops),
        ]
      : [allShopsDataset(coffeeShops)],
  };

  const options = createOptions(onClick);

  function onClick(event: ChartEvent) {
    const point = toDataCoordinates(event.x!, event.y!, chartRef.current);

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
        animation: {
          duration: 300,
        },
      },
    },
    onClick: onClick,
    animation: {
      duration: 0,
    },
  };
}

function tooltipTitle(tooltipItems: TooltipItem<"scatter">[]) {
  return tooltipItems.map((item) => (item.raw as DataPoint).title).join("\n");
}

function toDataCoordinates(canvasX: number, canvasY: number, chart: Chart) {
  return {
    x: round(chart.scales.x.getValueForPixel(canvasX)!),
    y: round(chart.scales.y.getValueForPixel(canvasY)!),
  };
}

function round(a: number) {
  return Math.round(a * 10) / 10;
}

function isWithinBounds({ x, y }: Point) {
  return -180 <= x && x <= 180 && -90 <= y && y <= 90;
}

function allShopsDataset(coffeeShops: CoffeeShop[]): Dataset {
  return {
    label: "All coffee shops",
    data: coffeeShops.map((coffeeShop) => ({
      title: coffeeShop.name,
      x: coffeeShop.x,
      y: coffeeShop.y,
    })),
    borderColor: "rgba(53, 162, 235, 1)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };
}

function closestShopsDataset(coffeeShops: CoffeeShop[]): Dataset {
  return {
    label: "Closest coffee shops",
    data: coffeeShops.map((coffeeShop) => ({
      title: coffeeShop.name,
      x: coffeeShop.x,
      y: coffeeShop.y,
    })),
    borderColor: "rgba(235, 53, 162, 1)",
    backgroundColor: "rgba(235, 53, 162, 0.5)",
  };
}

function otherShopsDataset(coffeeShops: CoffeeShop[]): Dataset {
  return {
    label: "Other coffee shops",
    data: coffeeShops.map((coffeeShop) => ({
      title: coffeeShop.name,
      x: coffeeShop.x,
      y: coffeeShop.y,
    })),
    borderColor: "rgba(53, 162, 235, 0.25)",
    backgroundColor: "rgba(53, 162, 235, 0.12)",
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
    borderColor: "rgba(162, 235, 53, 1)",
    backgroundColor: "rgba(162, 235, 53, 0.5)",
  };
}
