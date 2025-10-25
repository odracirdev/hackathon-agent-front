import { Bot, CheckCircle2, Package, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { AgentCard } from './AgentCard';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'waiting' | 'error';
  lastAction: string;
  company: string;
  tasksCompleted: number;
}

interface AgentsViewProps {
  onOpenChat: (agentName: string) => void;
}

const agents: Agent[] = [
  {
    id: '1',
    name: 'Agente Principal',
    status: 'active',
    lastAction: 'Actualización de stock',
    company: 'TechCorp S.A.',
    tasksCompleted: 156
  },
  {
    id: '2',
    name: 'Agente de Análisis',
    status: 'active',
    lastAction: 'Generación de reporte',
    company: 'TechCorp S.A.',
    tasksCompleted: 89
  },
  {
    id: '3',
    name: 'Agente de Alertas',
    status: 'waiting',
    lastAction: 'Monitoreo de stock bajo',
    company: 'TechCorp S.A.',
    tasksCompleted: 234
  },
  {
    id: '4',
    name: 'Agente de Pedidos',
    status: 'active',
    lastAction: 'Procesamiento de orden',
    company: 'TechCorp S.A.',
    tasksCompleted: 67
  }
];

export function AgentsView({ onOpenChat }: AgentsViewProps) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Agentes de Inteligencia Artificial</h1>
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
            Actualizado hace 2 minutos
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              {...agent}
              onOpenChat={() => onOpenChat(agent.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
