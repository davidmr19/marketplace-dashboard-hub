import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useState } from "react";

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
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>("");

  const totalEarnings = salesData.reduce((sum, day) => sum + day.amount, 0);

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Resumen General</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Configurar Retiros Automáticos</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurar Retiros Automáticos</DialogTitle>
                  <DialogDescription>
                    Configura el método de retiro automático cada 15 días
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Select
                    value={withdrawalMethod}
                    onValueChange={setWithdrawalMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método de retiro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="bank">Transferencia Bancaria</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full" onClick={() => console.log("Configurar retiro:", withdrawalMethod)}>
                    Guardar Configuración
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
              <p className="text-2xl font-semibold mt-1">${totalEarnings}</p>
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