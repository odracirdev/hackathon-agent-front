// biome-ignore assist/source/organizeImports: <explanation>
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Package, AlertTriangle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { AgentCard } from "./AgentCard";
import { apiFetchAgent } from "../lib/api";

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
		apiFetchAgent<Agent[]>('/agents')
			.then((data: Agent[]) => {
				if (!mounted) return;
				// Check if response is wrapped in an object
				let agents = data;
				if (data && typeof data === 'object' && !Array.isArray(data)) {
					// Try common wrapper properties
					if ((data as any).data && Array.isArray((data as any).data)) {
						agents = (data as any).data;
					} else if ((data as any).agents && Array.isArray((data as any).agents)) {
						agents = (data as any).agents;
					} else if ((data as any).result && Array.isArray((data as any).result)) {
						agents = (data as any).result;
					}
				}
				
				const finalAgents = Array.isArray(agents) ? agents : [];
				setAgentsState(finalAgents);
			})
			.catch((err: unknown) => {
				console.error('[AgentsView] Failed to load agents', err);
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

	// Derived metrics from agentsState
	const totalAgents = agentsState.length;
	const activeAgents = agentsState.filter((a) => a.status === 'active').length;
	const errorAgents = agentsState.filter((a) => a.status === 'error').length;
	const tasksCompletedTotal = agentsState.reduce((acc, a) => acc + (a.tasksCompleted || 0), 0);


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
					value={loading ? '…' : `${activeAgents}/${totalAgents}`}
					change={loading ? '' : `${activeAgents} activos`}
					icon={Bot}
					trend={activeAgents > 0 ? 'up' : 'neutral'}
				/>
				<MetricCard
					title="Requerimientos Hoy"
					value={loading ? '…' : String(tasksCompletedTotal)}
					change={loading ? '' : `${tasksCompletedTotal} tareas completadas`}
					icon={CheckCircle2}
					trend={tasksCompletedTotal > 0 ? 'up' : 'neutral'}
				/>
				<MetricCard
					title="Productos Actualizados"
					value={loading ? '…' : String(tasksCompletedTotal)}
					change={loading ? '' : 'Última hora'}
					icon={Package}
					trend="neutral"
				/>
				<MetricCard
					title="Alertas de Inventario"
					value={loading ? '…' : String(errorAgents)}
					change={loading ? '' : `${errorAgents} con errores`}
					icon={AlertTriangle}
					trend={errorAgents > 0 ? 'down' : 'neutral'}
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
