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
    aspectRatio: 2.2,
    elements: {
      point: {
        radius: 6,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems: TooltipItem<"scatter">[]) {
            return tooltipItems
              .map((item) => (item.raw as CoffeeShop).name)
              .join("\n");
          },
        },
      },
    },
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
  };
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
