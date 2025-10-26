// biome-ignore assist/source/organizeImports: <explanation>
import { MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface AgentCardProps {
	id: number;
	name: string;
	model: string;
	description: string;
	onOpenChat: () => void;
}

export function AgentCard({
	name,
	model,
	description,
	onOpenChat,
}: AgentCardProps) {
	return (
		<Card className="p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-100">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="text-gray-900 font-semibold mb-1">{name}</h3>
					<Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
						{model}
					</Badge>
				</div>
			</div>

			<p className="text-sm text-gray-600 mb-4 line-clamp-2">
				{description}
			</p>

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
