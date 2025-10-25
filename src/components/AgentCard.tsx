import { MessageSquare, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AgentCardProps {
  id: string;
  name: string;
  status: 'active' | 'waiting' | 'error';
  lastAction: string;
  company: string;
  tasksCompleted: number;
  onOpenChat: () => void;
}

export function AgentCard({ 
  name, 
  status, 
  lastAction, 
  company, 
  tasksCompleted,
  onOpenChat 
}: AgentCardProps) {
  const getStatusColor = () => {
    if (status === 'active') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'error') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const getStatusText = () => {
    if (status === 'active') return 'Activo';
    if (status === 'error') return 'Error';
    return 'En espera';
  };

  const getStatusIcon = () => {
    if (status === 'active') return '🟢';
    if (status === 'error') return '🔴';
    return '🟡';
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
        <Badge variant="outline" className={getStatusColor()}>
          {getStatusIcon()} {getStatusText()}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Última acción:</span>
          <span className="text-gray-900">{lastAction}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tareas completadas:</span>
          <span className="text-gray-900">{tasksCompleted}</span>
        </div>
      </div>

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
