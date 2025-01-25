import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const salesData = [
  { date: "01/15", amount: 1200 },
  { date: "01/16", amount: 1400 },
  { date: "01/17", amount: 1300 },
  { date: "01/18", amount: 1800 },
  { date: "01/19", amount: 1600 },
  { date: "01/20", amount: 2000 },
  { date: "01/21", amount: 1900 },
];

const topProducts = [
  { name: "Camiseta Premium", sales: 45 },
  { name: "Pantalón Vaquero", sales: 32 },
  { name: "Zapatillas Sport", sales: 28 },
  { name: "Chaqueta Invierno", sales: 25 },
  { name: "Gorra Classic", sales: 20 },
];

const Stats = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Ventas Últimos 15 Días</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#7C3AED"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Productos Más Vendidos</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#7C3AED" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
              <p className="text-2xl font-semibold mt-1">$12,450</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Productos Activos</h3>
              <p className="text-2xl font-semibold mt-1">45</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Visitas Totales</h3>
              <p className="text-2xl font-semibold mt-1">2,890</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Tasa de Conversión</h3>
              <p className="text-2xl font-semibold mt-1">3.2%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;