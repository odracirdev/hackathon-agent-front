// biome-ignore assist/source/organizeImports: <explanation>
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Package, AlertTriangle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { AgentCard } from "./AgentCard";
import { apiFetchAgent } from "../lib/api";

interface Agent {
	id: number;
	name: string;
	model: string;
	description: string;
	tasksCompleted?: number;
	status?: "active" | "waiting" | "error";
	lastAction?: string;
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
		
		// Load agents and tasks in parallel
		Promise.all([
			apiFetchAgent<Agent[]>('/agents'),
			apiFetchAgent<any[]>('/tasks').catch(() => []), // Tasks might fail, use empty array
			apiFetchAgent<any[]>('/alerts').catch(() => []) // Alerts might fail, use empty array
		])
			.then(([agentsData, tasksData]) => {
				if (!mounted) return;
				
				// Check if agents response is wrapped in an object
				let agents = agentsData;
				if (agentsData && typeof agentsData === 'object' && !Array.isArray(agentsData)) {
					// Try common wrapper properties
					if ((agentsData as any).data && Array.isArray((agentsData as any).data)) {
						agents = (agentsData as any).data;
					} else if ((agentsData as any).agents && Array.isArray((agentsData as any).agents)) {
						agents = (agentsData as any).agents;
					} else if ((agentsData as any).result && Array.isArray((agentsData as any).result)) {
						agents = (agentsData as any).result;
					}
				}
				
				const finalAgents = Array.isArray(agents) ? agents : [];
				
				// Enrich agents with tasks data
				const tasksArray = Array.isArray(tasksData) ? tasksData : [];
				const enrichedAgents = finalAgents.map(agent => ({
					...agent,
					tasksCompleted: tasksArray.filter(t => t.agentId === agent.id || t.agent_id === agent.id).length,
					status: 'active' as const,
					lastAction: new Date().toLocaleDateString('es-ES')
				}));
				
				setAgentsState(enrichedAgents);
			})
			.catch((err: unknown) => {
				console.error('[AgentsView] Failed to load data', err);
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
					change={loading ? '' : `${activeAgents} disponibles`}
					icon={Bot}
					trend={activeAgents > 0 ? 'up' : 'neutral'}
				/>
				<MetricCard
					title="Tareas Completadas"
					value={loading ? '…' : String(tasksCompletedTotal)}
					change={loading ? '' : `${tasksCompletedTotal} tareas`}
					icon={CheckCircle2}
					trend={tasksCompletedTotal > 0 ? 'up' : 'neutral'}
				/>
				<MetricCard
					title="Modelos Usados"
					value={loading ? '…' : String(new Set(agentsState.map(a => a.model)).size)}
					change={loading ? '' : 'Diferentes modelos'}
					icon={Package}
					trend="neutral"
				/>
				<MetricCard
					title="Productividad"
					value={loading ? '…' : '100%'}
					change={loading ? '' : 'Sistema operativo'}
					icon={AlertTriangle}
					trend="up"
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
