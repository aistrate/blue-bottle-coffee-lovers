import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { CoffeeShop } from "./models";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type CoffeeShopsChartProps = {
  coffeeShops: CoffeeShop[];
};

export default function CoffeeShopsChart({
  coffeeShops,
}: CoffeeShopsChartProps) {
  const options = createOptions();
  const data = createData(coffeeShops);

  return <Scatter options={options} data={data} />;
}

function createOptions() {
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

function onClick(event: any) {
  const chartX =
    Math.round(
      (((event.x - event.chart.chartArea.left) / event.chart.chartArea.width) *
        360 -
        180) *
        10
    ) / 10;

  const chartY =
    Math.round(
      (90 -
        ((event.y - event.chart.chartArea.top) / event.chart.chartArea.height) *
          180) *
        10
    ) / 10;

  if (-180 <= chartX && chartX <= 180 && -90 <= chartY && chartY <= 90) {
    const data = [
      {
        name: "Current location",
        x: chartX,
        y: chartY,
      },
    ];
  }
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
