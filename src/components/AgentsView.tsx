// biome-ignore assist/source/organizeImports: <explanation>
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Package, AlertTriangle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { AgentCard } from "./AgentCard";
import { apiFetch } from "../lib/api";

interface Agent {
	id: string;
	name: string;
	status: "active" | "waiting" | "error";
	lastAction: string;
	company: string;
	tasksCompleted: number;
}

interface AgentsViewProps {
	onOpenChat: (agentName: string) => void;
}

export function AgentsView({ onOpenChat }: AgentsViewProps) {
	const [agentsState, setAgentsState] = useState<Agent[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		apiFetch<Agent[]>('/agents')
			.then((data: Agent[]) => {
				if (!mounted) return;
				setAgentsState(Array.isArray(data) ? data : []);
			})
			.catch((err: unknown) => {
				console.error('Failed to load agents', err);
				if (!mounted) return;
				const message = err && typeof err === 'object' && 'message' in err ? (err as any).message : String(err);
				setError(String(message));
			})
			.finally(() => {
				if (!mounted) return;
				setLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, []);

	const agentsToRender = agentsState;

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-gray-900 mb-2">
					Agentes de Inteligencia Artificial
				</h1>
				<p className="text-gray-600">
					Gestiona y monitorea tus agentes IA en tiempo real
				</p>
			</div>

			{/* Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<MetricCard
					title="Agentes Activos"
					value="3/4"
					change="+1 desde ayer"
					icon={Bot}
					trend="up"
				/>
				<MetricCard
					title="Requerimientos Hoy"
					value="127"
					change="+23% vs ayer"
					icon={CheckCircle2}
					trend="up"
				/>
				<MetricCard
					title="Productos Actualizados"
					value="45"
					change="En las últimas 2h"
					icon={Package}
					trend="neutral"
				/>
				<MetricCard
					title="Alertas de Inventario"
					value="8"
					change="Requieren atención"
					icon={AlertTriangle}
					trend="down"
				/>
			</div>

			{/* Agents Grid */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-gray-900">Agentes Disponibles</h2>
					<div className="text-sm text-gray-500">
						{loading ? 'Cargando agentes...' : error ? `Error: ${error}` : 'Actualizado hace 2 minutos'}
					</div>
				</div>

				{agentsToRender.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{agentsToRender.map((agent: Agent) => (
							<AgentCard
								key={agent.id}
								{...agent}
								onOpenChat={() => onOpenChat(agent.name)}
							/>
						))}
					</div>
				) : (
					<div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
						{loading ? 'Cargando agentes...' : error ? `Error cargando agentes: ${error}` : 'No se encontraron agentes.'}
					</div>
				)}
			</div>
		</div>
	);
}
