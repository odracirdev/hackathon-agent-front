import React, { useState, createContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatPanel } from "./ChatPanel";

interface ChatContextValue {
  openChat: (agentName: string) => void;
  toggleChat: (agentName?: string) => void;
  isOpen: boolean;
}

export const ChatContext = createContext<ChatContextValue>({
  openChat: () => {},
  toggleChat: () => {},
  isOpen: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");

  const openChat = (agentName: string) => {
    setSelectedAgent(agentName);
    setIsChatOpen(true);
  };

  const toggleChat = (agentName?: string) => {
    if (typeof agentName === "string" && agentName.length > 0) {
      setSelectedAgent(agentName);
    }
    setIsChatOpen((v) => !v);
  };

  const activeView = location.pathname.includes("inventory") ? "inventory" : "agents";
  const onNavigate = (view: string) => {
    if (view === "inventory") navigate("/inventory");
    else navigate("/agents");
  };

  return (
  <ChatContext.Provider value={{ openChat, toggleChat, isOpen: isChatOpen }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeView={activeView} onNavigate={onNavigate} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />

          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          agentName={selectedAgent}
        />
      </div>
    </ChatContext.Provider>
  );
}

export default Layout;
