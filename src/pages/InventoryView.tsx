// biome-ignore assist/source/organizeImports: <explanation>
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiFetchDetails } from "../lib/api";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

interface Product {
	id: number;
	name: string;
	category: string;
	description: string;
	stock: number;
	stockMinimum: number;
	price: number;
	image: string;
	created_at: string;
	updated_at?: string;
	[key: string]: any; // Allow other fields from backend
}


export function InventoryView() {
	// products will be loaded from the "second" API (VITE_SECOND_API_BASE)
	// No local mock data: the view depends exclusively on the API.
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		category: '',
		description: '',
		stock: '',
		stockMinimum: '',
		price: '',
		image: '',
	});

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);

		// Assumption: the second API exposes a products endpoint at /products
		// If your backend uses a different path (e.g. /inventory), change it here.
		apiFetchDetails<Product[]>('/products')
			.then((data) => {
				if (!mounted) return;
				// Check if response is wrapped in an object
				let products = data;
				if (data && typeof data === 'object' && !Array.isArray(data)) {
					// Try common wrapper properties
					if ((data as any).data && Array.isArray((data as any).data)) {
						products = (data as any).data;
					} else if ((data as any).products && Array.isArray((data as any).products)) {
						products = (data as any).products;
					} else if ((data as any).result && Array.isArray((data as any).result)) {
						products = (data as any).result;
					}
				}
				
				const finalProducts = Array.isArray(products) ? products : [];
				setProducts(finalProducts);
			})
			.catch((err) => {
				if (!mounted) return;
				console.error('[InventoryView] Error fetching products:', err);
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

	const handleFormChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.category || !formData.description || !formData.stock || !formData.stockMinimum || !formData.price || !formData.image) {
			alert('Por favor completa todos los campos');
			return;
		}

		setIsSubmitting(true);
		try {
			const newProduct = {
				name: formData.name,
				category: formData.category,
				description: formData.description,
				stock: parseInt(formData.stock, 10),
				stockMinimum: parseInt(formData.stockMinimum, 10),
				price: parseFloat(formData.price),
				image: formData.image,
			};

			// POST to /products endpoint
			await apiFetchDetails('/products', {
				method: 'POST',
				data: newProduct,
			});

			// Reset form and close dialog
			setFormData({ name: '', category: '', description: '', stock: '', stockMinimum: '', price: '', image: '' });
			setIsModalOpen(false);
			apiFetchDetails<Product[]>('/products')
				.then((data) => {
					setProducts(Array.isArray(data) ? data : []);
				})
				.catch(() => {
					// silently fail, keep existing products
				});
		} catch (err) {
			alert(`Error al agregar producto: ${err instanceof Error ? err.message : 'Intenta de nuevo'}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Layout>
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
				<Button 
					className="bg-blue-600 hover:bg-blue-700"
					onClick={() => setIsModalOpen(true)}
				>
					<Plus className="w-4 h-4 mr-2" />
					Agregar Producto
				</Button>
			</div>

			{/* Modal simple */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-gray-900">Agregar Nuevo Producto</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="name">Nombre del Producto</Label>
								<Input
									id="name"
									placeholder="Ej: Laptop Dell XPS 15"
									value={formData.name}
									onChange={(e) => handleFormChange('name', e.target.value)}
									disabled={isSubmitting}
								/>
							</div>
							<div>
								<Label htmlFor="category">Categoría</Label>
								<Input
									id="category"
									placeholder="Ej: Electrónica"
									value={formData.category}
									onChange={(e) => handleFormChange('category', e.target.value)}
									disabled={isSubmitting}
								/>
							</div>
							<div>
								<Label htmlFor="description">Descripción</Label>
								<Input
									id="description"
									placeholder="Ej: Laptop de alta performance"
									value={formData.description}
									onChange={(e) => handleFormChange('description', e.target.value)}
									disabled={isSubmitting}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="stock">Stock</Label>
									<Input
										id="stock"
										placeholder="Ej: 45"
										type="number"
										value={formData.stock}
										onChange={(e) => handleFormChange('stock', e.target.value)}
										disabled={isSubmitting}
									/>
								</div>
								<div>
									<Label htmlFor="stockMinimum">Stock Mínimo</Label>
									<Input
										id="stockMinimum"
										placeholder="Ej: 10"
										type="number"
										value={formData.stockMinimum}
										onChange={(e) => handleFormChange('stockMinimum', e.target.value)}
										disabled={isSubmitting}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="price">Precio</Label>
									<Input
										id="price"
										placeholder="Ej: 1299.99"
										type="number"
										step="0.01"
										value={formData.price}
										onChange={(e) => handleFormChange('price', e.target.value)}
										disabled={isSubmitting}
									/>
								</div>
								<div>
									<Label htmlFor="image">URL de Imagen</Label>
									<Input
										id="image"
										placeholder="Ej: https://example.com/imagen.jpg"
										value={formData.image}
										onChange={(e) => handleFormChange('image', e.target.value)}
										disabled={isSubmitting}
									/>
								</div>
							</div>
							<div className="flex gap-2 justify-end pt-4">
								<Button
									type="button"
									variant="ghost"
									onClick={() => setIsModalOpen(false)}
									disabled={isSubmitting}
								>
									Cancelar
								</Button>
								<Button
									type="submit"
									className="bg-blue-600 hover:bg-blue-700"
									disabled={isSubmitting}
								>
									{isSubmitting ? 'Agregando...' : 'Agregar Producto'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}

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
											{product.updated_at || product.created_at || 'N/A'}
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
		</Layout>
	);
}
