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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Stats = () => {
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>("");
  const [btcWallet, setBtcWallet] = useState("");
  const [iban, setIban] = useState("");
  const { toast } = useToast();

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch sales data
  const { data: salesData } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('created_at, amount')
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (error) throw error;
      return data.map(sale => ({
        date: new Date(sale.created_at).toLocaleDateString(),
        amount: Number(sale.amount)
      }));
    },
  });

  // Fetch top products
  const { data: topProducts } = useQuery({
    queryKey: ['topProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('title, id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      const productsWithSales = await Promise.all(
        data.map(async (product) => {
          const { count } = await supabase
            .from('sales')
            .select('*', { count: 'exact' })
            .eq('product_id', product.id);
          
          return {
            name: product.title,
            sales: count || 0
          };
        })
      );
      
      return productsWithSales.sort((a, b) => b.sales - a.sales).slice(0, 5);
    },
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const [salesTotal, productsCount, viewsTotal] = await Promise.all([
        supabase
          .from('sales')
          .select('amount')
          .eq('user_id', userId),
        supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('user_id', userId),
        supabase
          .from('products')
          .select('views')
          .eq('user_id', userId),
      ]);

      const totalSales = salesTotal.data?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
      const activeProducts = productsCount.count || 0;
      const totalViews = viewsTotal.data?.reduce((sum, product) => sum + (product.views || 0), 0) || 0;
      const conversionRate = totalViews > 0 ? ((salesTotal.data?.length || 0) / totalViews) * 100 : 0;

      return {
        totalSales,
        activeProducts,
        totalViews,
        conversionRate
      };
    },
  });

  useEffect(() => {
    if (profile) {
      setWithdrawalMethod(profile.withdrawal_method || "");
      setBtcWallet(profile.btc_wallet || "");
      setIban(profile.iban || "");
    }
  }, [profile]);

  const handleSaveWithdrawalConfig = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        withdrawal_method: withdrawalMethod,
        btc_wallet: btcWallet,
        iban: iban,
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración",
      });
    } else {
      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Ventas Últimos 15 Días</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData || []}>
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
              <BarChart data={topProducts || []}>
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
                  
                  {withdrawalMethod === 'btc' && (
                    <Input
                      placeholder="Dirección de Wallet BTC"
                      value={btcWallet}
                      onChange={(e) => setBtcWallet(e.target.value)}
                    />
                  )}
                  
                  {withdrawalMethod === 'bank' && (
                    <Input
                      placeholder="IBAN"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                    />
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={handleSaveWithdrawalConfig}
                  >
                    Guardar Configuración
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
              <p className="text-2xl font-semibold mt-1">
                ${stats?.totalSales.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Productos Activos</h3>
              <p className="text-2xl font-semibold mt-1">
                {stats?.activeProducts || 0}
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Visitas Totales</h3>
              <p className="text-2xl font-semibold mt-1">
                {stats?.totalViews || 0}
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Tasa de Conversión</h3>
              <p className="text-2xl font-semibold mt-1">
                {stats?.conversionRate.toFixed(1) || '0.0'}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;