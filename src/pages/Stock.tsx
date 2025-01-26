import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Eye, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface StockVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  sales: number;
  views: number;
  rating: number;
  variants: StockVariant[];
}

const Stock = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          id,
          title,
          price,
          description,
          views,
          rating
        `);

      if (productsError) {
        toast({
          title: "Error",
          description: "Error al cargar los productos",
          variant: "destructive",
        });
        return [];
      }

      // Obtener las variantes para cada producto
      const productsWithVariants = await Promise.all(
        productsData.map(async (product) => {
          const { data: variants, error: variantsError } = await supabase
            .from("product_variants")
            .select("*")
            .eq("product_id", product.id);

          if (variantsError) {
            console.error("Error fetching variants:", variantsError);
            return {
              ...product,
              variants: [],
            };
          }

          // Obtener el total de ventas para este producto
          const { data: sales, error: salesError } = await supabase
            .from("sales")
            .select("quantity")
            .eq("product_id", product.id);

          const totalSales = salesError ? 0 : sales?.reduce((acc, sale) => acc + sale.quantity, 0) || 0;

          return {
            ...product,
            sales: totalSales,
            variants: variants || [],
          };
        })
      );

      return productsWithVariants;
    },
  });

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 shadow-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Card className="p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Inventario</h1>
          <div className="relative w-64">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock Total</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Vistas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const totalStock = product.variants.reduce(
                  (acc, variant) => acc + variant.stock,
                  0
                );

                return (
                  <TableRow key={product.id} className="animate-slide-in">
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{totalStock}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{product.views}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver más
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>
                {selectedProduct?.rating
                  ? `${selectedProduct.rating.toFixed(1)} de 5 estrellas`
                  : "Sin calificaciones"}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Stock por Variante</h3>
            <div className="grid gap-2">
              {selectedProduct?.variants.map((variant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <span className="font-medium">
                    Talla {variant.size} - {variant.color}
                  </span>
                  <span className="text-muted-foreground">
                    {variant.stock} unidades
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stock;