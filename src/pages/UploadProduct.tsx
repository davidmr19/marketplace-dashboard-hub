import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Upload } from "lucide-react";

interface SizeColor {
  size: string;
  color: string;
  stock: number;
}

const UploadProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [sizeColors, setSizeColors] = useState<SizeColor[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages([...images, ...filesArray]);
      
      // Create preview URLs
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const addSizeColor = () => {
    setSizeColors([...sizeColors, { size: "", color: "", stock: 0 }]);
  };

  const removeSizeColor = (index: number) => {
    const newSizeColors = [...sizeColors];
    newSizeColors.splice(index, 1);
    setSizeColors(newSizeColors);
  };

  const updateSizeColor = (index: number, field: keyof SizeColor, value: string | number) => {
    const newSizeColors = [...sizeColors];
    newSizeColors[index] = { ...newSizeColors[index], [field]: value };
    setSizeColors(newSizeColors);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Card className="p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">Subir Nuevo Producto</h1>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="shortDesc">Descripción Corta</Label>
            <Input
              id="shortDesc"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="longDesc">Descripción Larga</Label>
            <Textarea
              id="longDesc"
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label>Imágenes</Label>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <Upload className="h-6 w-6 text-gray-400" />
              </label>
            </div>
          </div>

          <div>
            <Label>Tallas, Colores y Stock</Label>
            <div className="space-y-4 mt-2">
              {sizeColors.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <Input
                    placeholder="Talla"
                    value={item.size}
                    onChange={(e) => updateSizeColor(index, "size", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Color"
                    value={item.color}
                    onChange={(e) => updateSizeColor(index, "color", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={item.stock}
                    onChange={(e) => updateSizeColor(index, "stock", parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSizeColor(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSizeColor}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Talla/Color
              </Button>
            </div>
          </div>

          <Button className="w-full">
            Subir Producto
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UploadProduct;