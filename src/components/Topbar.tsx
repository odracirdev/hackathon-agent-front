// biome-ignore assist/source/organizeImports: <explanation>
// import { Bell, Settings } from "lucide-react";
import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Topbar() {
	return (
		<div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-gray-900">Pepito Perez</span>
						<Badge variant="outline" className="text-xs">
							Admin
						</Badge>
					</div>
					<div className="text-sm text-gray-500">
						pepito.perez@uxcorp.com
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				{/* System Status */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span className="text-sm text-green-700">Sistema Activo</span>
					</div>
				</div>

				{/* Notifications
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="w-5 h-5" />
					<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
				</Button> */}

				{/* Settings
				<Button variant="ghost" size="icon">
					<Settings className="w-5 h-5" />
				</Button> */}

				{/* User Avatar */}
				<Avatar>
					<AvatarFallback className="bg-blue-100 text-blue-600">
						PP
					</AvatarFallback>
				</Avatar>
			</div>
		</div>
	);
}
