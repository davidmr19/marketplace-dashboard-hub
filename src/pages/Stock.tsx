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

interface StockVariant {
  size: string;
  color: string;
  quantity: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  sales: number;
  views: number;
  rating: number;
  variants: StockVariant[];
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Camiseta Premium",
    price: 29.99,
    stock: 150,
    sales: 45,
    views: 1200,
    rating: 4.5,
    variants: [
      { size: "XS", color: "Verde", quantity: 50 },
      { size: "S", color: "Verde", quantity: 30 },
      { size: "M", color: "Azul", quantity: 40 },
      { size: "L", color: "Rojo", quantity: 30 },
    ],
  },
  {
    id: 2,
    title: "Pantalón Vaquero",
    price: 59.99,
    stock: 80,
    sales: 32,
    views: 890,
    rating: 4.2,
    variants: [
      { size: "S", color: "Azul", quantity: 20 },
      { size: "M", color: "Negro", quantity: 35 },
      { size: "L", color: "Azul", quantity: 25 },
    ],
  },
];

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Card className="p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Priv Shop</h1>
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
                <TableHead>Stock</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Vistas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="animate-slide-in">
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
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
              ))}
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
              <span>{selectedProduct?.rating.toFixed(1)} de 5 estrellas</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
              <p className="text-2xl font-semibold">{selectedProduct?.sales}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Visitas</p>
              <p className="text-2xl font-semibold">{selectedProduct?.views}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Stock por Variante</h3>
            <div className="grid gap-2">
              {selectedProduct?.variants.map((variant, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="font-medium">
                    Talla {variant.size} - {variant.color}
                  </span>
                  <span className="text-muted-foreground">
                    {variant.quantity} unidades
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