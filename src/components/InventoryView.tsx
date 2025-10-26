// biome-ignore assist/source/organizeImports: <explanation>
import { useEffect, useState } from "react";
import { apiFetch2 } from "../lib/api";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

interface Product {
	id: string;
	name: string;
	category: string;
	stock: number;
	price: number;
	lastUpdate: string;
}


export function InventoryView() {
	// products will be loaded from the "second" API (VITE_SECOND_API_BASE)
	// No local mock data: the view depends exclusively on the API.
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);

		// Assumption: the second API exposes a products endpoint at /products
		// If your backend uses a different path (e.g. /inventory), change it here.
		apiFetch2<Product[]>('/products')
			.then((data) => {
				if (!mounted) return;
				// Accept empty arrays from the API (renders as empty state)
				setProducts(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err?.message || 'Error al cargar productos');
				// keep products empty on error
				setProducts([]);
			})
			.finally(() => {
				if (!mounted) return;
				setLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, []);

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.category.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const getStockStatus = (stock: number) => {
		if (stock < 15)
			return { color: "bg-red-100 text-red-700 border-red-200", label: "Bajo" };
		if (stock < 30)
			return {
				color: "bg-yellow-100 text-yellow-700 border-yellow-200",
				label: "Medio",
			};
		return {
			color: "bg-green-100 text-green-700 border-green-200",
			label: "Alto",
		};
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
			{loading && (
				<div className="mb-4 text-sm text-gray-600">Cargando productos...</div>
			)}
			{error && (
				<div className="mb-4 text-sm text-red-600">Error: {error}</div>
			)}
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
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-red-600 hover:text-red-700"
											>
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
					Total de unidades en inventario:{" "}
					{products.reduce((acc, p) => acc + p.stock, 0)}
				</div>
			</div>
		</div>
	);
}
