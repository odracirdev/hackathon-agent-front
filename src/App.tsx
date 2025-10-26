// biome-ignore assist/source/organizeImports: <explanation>
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { AgentsView } from "./pages/AgentsView";
import { InventoryView } from "./pages/InventoryView";
import { ChatPanel } from "./components/ChatPanel";

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
			case "agents":
				return <AgentsView onOpenChat={handleOpenChat} />;
			case "inventory":
				return <InventoryView />;
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

