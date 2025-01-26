import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Referrals = () => {
  const { toast } = useToast();
  const referralLink = `${window.location.origin}?ref=${crypto.randomUUID()}`;

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
          <h2 className="text-lg font-semibold mb-2">Tu enlace de referido</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 p-2 border rounded bg-gray-50"
            />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Referidos totales</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ganancias por referidos</p>
              <p className="text-2xl font-semibold">$0.00</p>
            </div>
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