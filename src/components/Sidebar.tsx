// biome-ignore assist/source/organizeImports: <explanation>
import {
	Home,
	Bot,
	Package,
	History,
	Settings,
	ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SidebarProps {
	activeView: string;
	onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
	const menuItems = [
		{ id: "overview", label: "Overview", icon: Home },
		{ id: "agents", label: "Agentes IA", icon: Bot },
		{ id: "inventory", label: "Inventario", icon: Package },
		{ id: "history", label: "Historial", icon: History },
		{ id: "settings", label: "Configuración", icon: Settings },
	];

	return (
		<div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
			{/* Logo */}
			<div className="p-6 border-b border-gray-200">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<Bot className="w-5 h-5 text-white" />
					</div>
					<div>
						<div className="text-gray-900">AI Inventory</div>
						<div className="text-gray-600 text-sm">Manager</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4">
				<div className="space-y-1">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeView === item.id;

						return (
							// biome-ignore lint/a11y/useButtonType: <explanation>
							<button
								key={item.id}
								onClick={() => onNavigate(item.id)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
									isActive
										? "bg-blue-50 text-blue-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}
							>
								<Icon className="w-5 h-5" />
								<span>{item.label}</span>
								{isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
							</button>
						);
					})}
				</div>
			</nav>

			{/* User Info */}
			<div className="p-4 border-t border-gray-200">
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src="" />
						<AvatarFallback className="bg-blue-100 text-blue-600">
							TC
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="text-sm text-gray-900">TechCorp S.A.</div>
						<div className="text-xs text-gray-500">Premium Plan</div>
					</div>
				</div>
			</div>
		</div>
	);
}
