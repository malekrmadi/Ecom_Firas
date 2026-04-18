import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Send, Bot, User, Sparkles, PieChart, ShoppingBag, Users, TrendingUp, ChevronRight, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { label: "Nombre total de produits", icon: ShoppingBag, query: "Quel est le nombre total de produits en stock ?" },
  { label: "Commandes cette semaine", icon: PieChart, query: "Combien de commandes avons-nous reçues cette semaine ?" },
  { label: "Top clients (retours)", icon: Users, query: "Quels clients ont effectué le plus de retours ?" },
  { label: "Chiffre d'affaires du mois", icon: TrendingUp, query: "Quel est le chiffre d'affaires total pour ce mois ?" },
];

const MyStoreAgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant MyStore. Je peux vous aider à analyser vos statistiques, gérer vos stocks ou répondre à vos questions sur vos clients. Que souhaitez-vous savoir aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulation de réponse IA
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `C'est une excellente question ! Actuellement, je suis en phase de préparation pour me connecter à vos données réelles (API). Bientôt, je pourrai vous donner des analyses précises sur "${content}".`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Bot size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black m-0 leading-tight tracking-tight uppercase">MyStore Agent <span className="text-xs bg-red-600 px-2 py-0.5 rounded ml-2">v2.0 FIXED</span></h1>
              <p className="text-slate-400 text-sm m-0 flex items-center gap-1 font-bold">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                Assistant Connecté • Haute Visibilité
              </p>
            </div>
          </div>
          <Sparkles className="text-primary animate-pulse" size={32} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === "user" ? "bg-primary text-white" : "bg-white text-primary border border-gray-200"
                }`}>
                  {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-md text-base leading-relaxed font-bold ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none border-2 border-slate-700" 
                    : "bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-tl-none"
                }`}>
                  {msg.content}
                  <div className={`text-[10px] mt-2 font-black ${msg.role === "user" ? "text-slate-400 text-right" : "text-slate-500"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-white text-primary border border-gray-200 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-xs text-muted font-medium">L'agent analyse vos données...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-4 bg-white border-t border-gray-100 overflow-x-auto">
          <div className="flex gap-3">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.query)}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 border border-gray-200 rounded-xl text-xs font-semibold transition-all"
              >
                <prompt.icon size={14} />
                {prompt.label}
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex gap-3 bg-white p-2 rounded-2xl border-4 border-primary shadow-2xl transition-all">
            <input
              type="text"
              className="flex-1 border-none outline-none px-4 py-2 text-sm chat-input-forced"
              placeholder="Posez une question sur votre boutique..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="bg-primary hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MyStoreAgentPage;
