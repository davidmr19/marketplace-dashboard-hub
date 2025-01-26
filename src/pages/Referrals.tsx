import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, UserPlus, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Referrals = () => {
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const generateReferralLink = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setReferralLink(`${window.location.origin}?ref=${user.id}`);
      }
    };
    generateReferralLink();
  }, []);

  const { data: referralStats } = useQuery({
    queryKey: ["referralStats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const [totalEarnings, totalReferrals] = await Promise.all([
        supabase.rpc('get_total_referral_earnings', { user_uuid: user.id }),
        supabase.rpc('get_total_referrals', { user_uuid: user.id })
      ]);

      return {
        earnings: totalEarnings.data || 0,
        total: totalReferrals.data || 0
      };
    }
  });

  const { data: referrals } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data } = await supabase
        .from("referrals")
        .select("*, referred_id")
        .eq("referrer_id", user.id);

      return data || [];
    }
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace de referido ha sido copiado al portapapeles",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo copiar el enlace",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Programa de Referidos</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Tu enlace de referido
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 p-2 border rounded bg-gray-50"
            />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Estadísticas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Referidos totales
              </p>
              <p className="text-2xl font-semibold">{referralStats?.total || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Ganancias
              </p>
              <p className="text-2xl font-semibold">${referralStats?.earnings || "0.00"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tus Referidos
          </h2>
          <div className="space-y-4">
            {referrals?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aún no tienes referidos. ¡Comparte tu enlace para empezar!
              </p>
            ) : (
              <div className="grid gap-4">
                {referrals?.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Usuario referido</p>
                        <p className="text-sm text-gray-500">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-green-600">
                      ${referral.commission_earned || "0.00"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">¿Cómo funciona?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="font-medium">Comparte tu enlace</h3>
                <p className="text-gray-600">
                  Comparte tu enlace único con otros vendedores
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="font-medium">Ellos se registran</h3>
                <p className="text-gray-600">
                  Cuando alguien se registra usando tu enlace, se convierte en tu referido
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="font-medium">Gana comisiones</h3>
                <p className="text-gray-600">
                  Gana un porcentaje de las ventas realizadas por tus referidos
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Referrals;