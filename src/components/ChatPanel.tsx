// biome-ignore assist/source/organizeImports: <explanation>
import { useState, useEffect, useRef } from "react";
import { X, Send, Mic, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { apiFetchAgent } from "../lib/api";
import { speakText, stopSpeaking, startListening } from "../lib/speech";

interface Message {
	id?: string;
	role: "user" | "assistant";
	content: string;
	timestamp?: string;
}

interface ChatPanelProps {
	isOpen: boolean;
	onClose: () => void;
	agentName: string;
}

export function ChatPanel({ isOpen, onClose, agentName }: ChatPanelProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);
	const [chatData, setChatData] = useState<{ slug: string; description: string } | null>(null);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const recognitionRef = useRef<any>(null);

	// Load voices on component mount
	useEffect(() => {
		if ('speechSynthesis' in window) {
			// Load voices
			window.speechSynthesis.getVoices();
			// Some browsers need this event
			window.speechSynthesis.onvoiceschanged = () => {
				window.speechSynthesis.getVoices();
			};
		}
	}, []);

	// Load chat messages when chat is opened (if chatId exists)
	// Only load on first open, not on every message
	useEffect(() => {
		if (isOpen && currentChatId && messages.length === 0) {
			loadChatMessages();
		}
	}, [isOpen, currentChatId]);

	// Auto-scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages]);

	const loadChatMessages = async () => {
		try {
			setLoading(true);
			const data = await apiFetchAgent<any>(`/chats/${currentChatId}`);
			
			const chatData = data?.chat || data;
			setMessages(chatData?.messages || []);
		} catch (err) {
			console.error("Failed to load chat messages", err);
			setError("Error al cargar los mensajes");
		} finally {
			setLoading(false);
		}
	};

	const handleSend = async () => {
		if (!inputValue.trim() || loading) return;

		const userMessage: Message = {
			role: "user",
			content: inputValue,
			timestamp: new Date().toLocaleTimeString("es-ES", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		// Add user message to UI immediately
		const updatedMessages = [...messages, userMessage];
		setMessages(updatedMessages);
		setInputValue("");
		setLoading(true);

		try {
			let chatId = currentChatId;
			let responseData: any;
			let currentChatData = chatData;

			// If this is the first message, create the chat first
			if (!chatId) {
				const slug = `chat-${agentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
				const description = `Chat con ${agentName}`;
				
				// Prepare messages - only role and content (no timestamp)
				const messagesForApi = updatedMessages.map((msg) => ({
					role: msg.role,
					content: msg.content
				}));
				
				const newChat = {
					user: "agent",
					slug: slug,
					description: description,
					messages: messagesForApi
				};
				
				responseData = await apiFetchAgent<any>("/chats", {
					method: "POST",
					data: newChat
				});
				
				const chat = responseData?.chat || (Array.isArray(responseData) ? responseData[0] : responseData);
				chatId = String(chat.id);
				currentChatData = { slug, description };
				
				setCurrentChatId(chatId);
				setChatData(currentChatData);
			} else {
				// Update existing chat with new message using PUT to /chats/{id}/messages
				// Send only the new user message
				const newUserMessage = {
					role: "user",
					content: inputValue
				};
				
				responseData = await apiFetchAgent<any>(`/chats/${chatId}/messages`, {
					method: "POST",
					data: newUserMessage
				});
			}

			// Get the assistant response from the API
			// Handle both POST /chats (returns result) and POST /chats/{id}/messages (returns assistantMessage)
			const assistantContent = responseData?.assistantMessage?.content 
				|| responseData?.result 
				|| "Entendido. Estoy procesando tu solicitud...";
			
			const assistantMessage: Message = {
				role: "assistant",
				content: assistantContent,
				timestamp: new Date().toLocaleTimeString("es-ES", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};

			// Add assistant response to the local state
			const finalMessages = [...updatedMessages, assistantMessage];
			setMessages(finalMessages);
			
			// Auto-play assistant response
			if (assistantContent) {
				setTimeout(() => {
					speakText(assistantContent);
					setIsSpeaking(true);
					// Reset speaking state after estimated speech duration
					setTimeout(() => setIsSpeaking(false), assistantContent.length * 50);
				}, 300); // Small delay to ensure message is rendered
			}
		} catch (err) {
			console.error("Failed to send message", err);
			setError("Error al enviar el mensaje");
		} finally {
			setLoading(false);
		}
	};

	const handleMicClick = () => {
		if (isListening) {
			// Stop listening
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
			setIsListening(false);
		} else {
			// Start listening
			setIsListening(true);
			recognitionRef.current = startListening(
				(transcript) => {
					setInputValue(transcript);
					setIsListening(false);
				},
				(error) => {
					console.error('Error en reconocimiento:', error);
					setError('Error al reconocer la voz');
					setIsListening(false);
				}
			);
		}
	};

	const handleSpeakMessage = (text: string) => {
		if (isSpeaking) {
			stopSpeaking();
			setIsSpeaking(false);
		} else {
			setIsSpeaking(true);
			speakText(text);
			// Reset speaking state after speech ends
			setTimeout(() => setIsSpeaking(false), text.length * 50); // Rough estimate
		}
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
				<Button 
					variant="ghost" 
					size="icon" 
					onClick={() => {
						onClose();
						// Don't reset chatId - it will persist for this agent
						setError(null);
					}}
				>
					<X className="w-5 h-5" />
				</Button>
			</div>

			{/* Error message */}
			{error && (
				<div className="px-6 py-2 text-sm text-red-600 bg-red-50">
					{error}
				</div>
			)}

			{/* Messages (scrollable) */}
			<div className="flex-1 overflow-auto p-6">
				<div className="flex flex-col space-y-4">
					{messages.length === 0 && !loading ? (
						<div className="text-center text-gray-500 text-sm">
							Comienza una conversación con {agentName}
						</div>
					) : (
						messages.map((message, idx) => (
							<div
								key={idx}
								className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 ${
										message.role === "user"
											? "bg-blue-600 text-white"
											: "bg-gray-100 text-gray-900"
									}`}
								>
									<div className="flex items-start gap-2">
										<div className="flex-1">
											<p className="text-sm">{message.content}</p>
											<p
												className={`text-xs mt-1 ${
													message.role === "user"
														? "text-blue-100"
														: "text-gray-500"
												}`}
											>
												{message.timestamp}
											</p>
										</div>
										{message.role === "assistant" && (
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6 flex-shrink-0"
												onClick={() => handleSpeakMessage(message.content)}
												title="Reproducir mensaje"
											>
												{isSpeaking ? (
													<VolumeX className="w-3 h-3" />
												) : (
													<Volume2 className="w-3 h-3" />
												)}
											</Button>
										)}
									</div>
								</div>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input */}
			<div className="p-6 border-t border-gray-200">
				<div className="flex gap-2">
					<Button
						onClick={handleMicClick}
						variant={isListening ? "default" : "outline"}
						size="icon"
						className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
						disabled={loading}
						title={isListening ? "Detener grabación" : "Grabar mensaje"}
					>
						<Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
					</Button>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
						placeholder={isListening ? "Escuchando..." : "Escribe un mensaje..."}
						className="flex-1"
						disabled={loading || isListening}
					/>
					<Button
						onClick={handleSend}
						className="bg-blue-600 hover:bg-blue-700"
						disabled={loading || !inputValue.trim()}
					>
						<Send className="w-4 h-4" />
					</Button>
				</div>
				<p className="text-xs text-gray-500 mt-2">
					{isListening ? "🔴 Grabando... Habla ahora" : "Presiona Enter para enviar o 🎤 para grabar"}
				</p>
			</div>
		</div>
	);
}
