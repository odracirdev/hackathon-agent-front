// biome-ignore assist/source/organizeImports: <explanation>
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { AgentsView } from "./components/AgentsView";
import { InventoryView } from "./components/InventoryView";
import { ChatPanel } from "./components/ChatPanel";
import { BarChart3, History, Settings as SettingsIcon } from "lucide-react";

export default function App() {
	const [activeView, setActiveView] = useState("agents");
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [selectedAgent, setSelectedAgent] = useState("");

	const handleOpenChat = (agentName: string) => {
		setSelectedAgent(agentName);
		setIsChatOpen(true);
	};

	const renderView = () => {
		switch (activeView) {
			// case "overview":
			// 	return <OverviewPlaceholder />;
			case "agents":
				return <AgentsView onOpenChat={handleOpenChat} />;
			case "inventory":
				return <InventoryView />;
			// case "history":
			// 	return <HistoryPlaceholder />;
			// case "settings":
			// 	return <SettingsPlaceholder />;
			default:
				return <AgentsView onOpenChat={handleOpenChat} />;
		}
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar activeView={activeView} onNavigate={setActiveView} />

			<div className="flex-1 flex flex-col overflow-hidden">
				<Topbar />

				<main className="flex-1 overflow-auto">{renderView()}</main>
			</div>

			<ChatPanel
				isOpen={isChatOpen}
				onClose={() => setIsChatOpen(false)}
				agentName={selectedAgent}
			/>
		</div>
	);
}

function OverviewPlaceholder() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-gray-900 mb-2">Overview</h1>
				<p className="text-gray-600">Panel general del sistema</p>
			</div>
			<div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
				<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p className="text-gray-500">Vista de overview próximamente</p>
			</div>
		</div>
	);
}

function HistoryPlaceholder() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-gray-900 mb-2">Historial</h1>
				<p className="text-gray-600">Registro de actividades del sistema</p>
			</div>
			<div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
				<History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p className="text-gray-500">Vista de historial próximamente</p>
			</div>
		</div>
	);
}

function SettingsPlaceholder() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-gray-900 mb-2">Configuración</h1>
				<p className="text-gray-600">Ajustes del sistema y preferencias</p>
			</div>
			<div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
				<SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p className="text-gray-500">Vista de configuración próximamente</p>
			</div>
		</div>
	);
}
