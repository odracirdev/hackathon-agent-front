import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  lastUpdate: string;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    category: 'Electrónica',
    stock: 45,
    price: 1299.99,
    lastUpdate: '2025-10-25 09:30'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    category: 'Electrónica',
    stock: 12,
    price: 999.99,
    lastUpdate: '2025-10-25 10:15'
  },
  {
    id: '3',
    name: 'Monitor LG 27" 4K',
    category: 'Electrónica',
    stock: 28,
    price: 449.99,
    lastUpdate: '2025-10-24 16:20'
  },
  {
    id: '4',
    name: 'Teclado Mecánico Logitech',
    category: 'Accesorios',
    stock: 67,
    price: 129.99,
    lastUpdate: '2025-10-25 08:45'
  },
  {
    id: '5',
    name: 'Mouse Inalámbrico MX Master',
    category: 'Accesorios',
    stock: 89,
    price: 99.99,
    lastUpdate: '2025-10-25 11:00'
  },
  {
    id: '6',
    name: 'Auriculares Sony WH-1000XM5',
    category: 'Audio',
    stock: 34,
    price: 349.99,
    lastUpdate: '2025-10-24 14:30'
  },
  {
    id: '7',
    name: 'SSD Samsung 1TB',
    category: 'Almacenamiento',
    stock: 156,
    price: 89.99,
    lastUpdate: '2025-10-25 07:15'
  },
  {
    id: '8',
    name: 'Webcam Logitech C920',
    category: 'Accesorios',
    stock: 8,
    price: 79.99,
    lastUpdate: '2025-10-23 13:45'
  }
];

export function InventoryView() {
  const [products] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock < 15) return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Bajo' };
    if (stock < 30) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Medio' };
    return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Alto' };
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Gestión de Inventario</h1>
        <p className="text-gray-600">
          Administra tus productos y mantén el control de tu stock
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="text-gray-900">{product.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={stockStatus.color}>
                      {product.stock} unidades
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {product.lastUpdate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <div>
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
        <div>
          Total de unidades en inventario: {products.reduce((acc, p) => acc + p.stock, 0)}
        </div>
      </div>
    </div>
  );
}
