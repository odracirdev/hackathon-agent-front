// biome-ignore assist/source/organizeImports: <explanation>
import { MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface AgentCardProps {
	id: number;
	name: string;
	model: string;
	description: string;
	tasksCompleted?: number;
	status?: "active" | "waiting" | "error";
	lastAction?: string;
	onOpenChat: () => void;
}

export function AgentCard({
	name,
	model,
	description,
	tasksCompleted = 0,
	status = "active",
	lastAction,
	onOpenChat,
}: AgentCardProps) {
	const getStatusIcon = () => {
		if (status === "active") return <CheckCircle2 className="w-4 h-4 text-green-600" />;
		if (status === "error") return <AlertCircle className="w-4 h-4 text-red-600" />;
		return <AlertCircle className="w-4 h-4 text-yellow-600" />;
	};

	const getStatusText = () => {
		if (status === "active") return "Activo";
		if (status === "error") return "Error";
		return "En espera";
	};

	const getStatusColor = () => {
		if (status === "active") return "bg-green-100 text-green-700 border-green-200";
		if (status === "error") return "bg-red-100 text-red-700 border-red-200";
		return "bg-yellow-100 text-yellow-700 border-yellow-200";
	};

	return (
		<Card className="p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-100">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="text-gray-900 font-semibold mb-1">{name}</h3>
					<div className="flex gap-2 flex-wrap">
						<Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
							{model}
						</Badge>
						<Badge variant="outline" className={getStatusColor()}>
							{getStatusIcon()} {getStatusText()}
						</Badge>
					</div>
				</div>
			</div>

			<p className="text-sm text-gray-600 mb-4 line-clamp-2">
				{description}
			</p>

			{tasksCompleted !== undefined && (
				<div className="text-xs text-gray-500 mb-4">
					Tareas completadas: <span className="font-semibold text-gray-700">{tasksCompleted}</span>
					{lastAction && <div>Última acción: {lastAction}</div>}
				</div>
			)}

			<Button
				onClick={onOpenChat}
				className="w-full bg-blue-600 hover:bg-blue-700"
			>
				<MessageSquare className="w-4 h-4 mr-2" />
				Ver chat
			</Button>
		</Card>
	);
}
