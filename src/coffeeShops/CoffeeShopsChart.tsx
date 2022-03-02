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
      y: {
        beginAtZero: true,
      },
    },
  };
}

function createData(coffeeShops: CoffeeShop[]) {
  return {
    datasets: [
      {
        label: "Blue Bottle Coffee Shops",
        data: coffeeShops.map((coffeeShop) => ({
          name: coffeeShop.name,
          x: coffeeShop.y,
          y: coffeeShop.x,
        })),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
}
