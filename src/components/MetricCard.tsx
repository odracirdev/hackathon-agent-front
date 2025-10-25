import type * as React from "react";
import { Card } from "./ui/card";

interface MetricCardProps {
	title: string;
	value: string | number;
	change?: string;
	// Component type for an SVG icon
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	trend?: "up" | "down" | "neutral";
}

export function MetricCard({
	title,
	value,
	change,
	icon: Icon,
	trend = "neutral",
}: MetricCardProps) {
	const getTrendColor = () => {
		if (trend === "up") return "text-green-600";
		if (trend === "down") return "text-red-600";
		return "text-gray-600";
	};

	return (
		<Card className="p-6 hover:shadow-lg transition-shadow">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm text-gray-600">{title}</p>
					<p className="text-gray-900 mt-2">{value}</p>
					{change && (
						<p className={`text-sm mt-1 ${getTrendColor()}`}>{change}</p>
					)}
				</div>
				<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
					<Icon className="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</Card>
	);
}
