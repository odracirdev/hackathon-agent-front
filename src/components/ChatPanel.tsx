// biome-ignore assist/source/organizeImports: <explanation>
import { useState } from "react";
import { X, Send, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
	id: string;
	sender: "user" | "agent";
	text: string;
	timestamp: string;
}

interface ChatPanelProps {
	isOpen: boolean;
	onClose: () => void;
	agentName: string;
}

export function ChatPanel({ isOpen, onClose, agentName }: ChatPanelProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			sender: "agent",
			text: "¡Hola! Soy el agente de inventario. ¿En qué puedo ayudarte hoy?",
			timestamp: "10:30",
		},
		{
			id: "2",
			sender: "user",
			text: "Necesito agregar 20 unidades de Laptop Dell XPS 15",
			timestamp: "10:31",
		},
		{
			id: "3",
			sender: "agent",
			text: "He agregado 20 unidades de Laptop Dell XPS 15 al inventario. El stock actual es de 45 unidades. ¿Necesitas algo más?",
			timestamp: "10:31",
		},
		{
			id: "4",
			sender: "user",
			text: "¿Cuál es el nivel de stock del iPhone 15 Pro?",
			timestamp: "10:32",
		},
		{
			id: "5",
			sender: "agent",
			text: "El iPhone 15 Pro tiene actualmente 12 unidades en stock. Está por debajo del nivel mínimo (20 unidades). ¿Deseas generar una orden de compra?",
			timestamp: "10:32",
		},
	]);
	const [inputValue, setInputValue] = useState("");

	const handleSend = () => {
		if (!inputValue.trim()) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			sender: "user",
			text: inputValue,
			timestamp: new Date().toLocaleTimeString("es-ES", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		setMessages([...messages, newMessage]);
		setInputValue("");

		// Simulate agent response
		setTimeout(() => {
			const agentResponse: Message = {
				id: (Date.now() + 1).toString(),
				sender: "agent",
				text: "Entendido. Estoy procesando tu solicitud...",
				timestamp: new Date().toLocaleTimeString("es-ES", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};
			setMessages((prev) => [...prev, agentResponse]);
		}, 1000);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
			{/* Header */}
			<div className="p-6 border-b border-gray-200 flex items-center justify-between">
				<div>
					<h2 className="text-gray-900">Chat con {agentName}</h2>
					<div className="flex items-center gap-1.5 mt-1">
						<div className="w-2 h-2 bg-green-500 rounded-full"></div>
						<span className="text-sm text-gray-500">En línea</span>
					</div>
				</div>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X className="w-5 h-5" />
				</Button>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-6">
				<div className="space-y-4">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[80%] rounded-2xl px-4 py-3 ${
									message.sender === "user"
										? "bg-blue-600 text-white"
										: "bg-gray-100 text-gray-900"
								}`}
							>
								<p className="text-sm">{message.text}</p>
								<p
									className={`text-xs mt-1 ${
										message.sender === "user"
											? "text-blue-100"
											: "text-gray-500"
									}`}
								>
									{message.timestamp}
								</p>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>

			{/* Input */}
			<div className="p-6 border-t border-gray-200">
				<div className="flex gap-2">
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSend()}
						placeholder="Escribe un mensaje..."
						className="flex-1"
					/>
					<Button variant="ghost" size="icon">
						<Mic className="w-5 h-5" />
					</Button>
					<Button
						onClick={handleSend}
						className="bg-blue-600 hover:bg-blue-700"
					>
						<Send className="w-4 h-4" />
					</Button>
				</div>
				<p className="text-xs text-gray-500 mt-2">Presiona Enter para enviar</p>
			</div>
		</div>
	);
}
