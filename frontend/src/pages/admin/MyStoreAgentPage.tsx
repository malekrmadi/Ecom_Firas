import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Send, Bot, User, Sparkles, PieChart, ShoppingBag, Users, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { label: "💰 CA Global", icon: TrendingUp, query: "Quel est mon chiffre d'affaires global ?" },
  { label: "🏆 Top 3 Produits", icon: ShoppingBag, query: "Quels sont mes 3 meilleurs produits en revenus ?" },
  { label: "👑 Top Clients", icon: Users, query: "Qui sont mes meilleurs clients ?" },
  { label: "⚠️ Retours", icon: PieChart, query: "Quels clients font le plus de retours ?" },
];

const MyStoreAgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant MyStore. Je suis maintenant connecté à vos données réelles. Je peux vous donner votre chiffre d'affaires, vos meilleurs produits ou analyser vos clients. Que souhaitez-vous savoir ?",
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(val);
  };

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

    try {
      let botResponse = "";
      const lowerContent = content.toLowerCase();

      if (lowerContent.includes("chiffre d'affaires") || lowerContent.includes("ca global")) {
        const { data } = await api.get('/chatbot/revenue/total');
        botResponse = `Votre chiffre d'affaires global total s'élève à **${formatCurrency(data.total_revenue || 0)}**. C'est un excellent résultat basé sur vos commandes livrées !`;
      } 
      else if (lowerContent.includes("produits") && (lowerContent.includes("meilleurs") || lowerContent.includes("top"))) {
        const { data } = await api.get('/chatbot/revenue/top-products?limit=3');
        if (data.length > 0) {
          const list = data.map((p: any, i: number) => `${i + 1}. **${p.product_name}** (${formatCurrency(p.revenue)})`).join("\n");
          botResponse = `Voici vos 3 meilleurs produits en termes de chiffre d'affaires :\n\n${list}\n\nCes produits tirent votre croissance vers le haut !`;
        } else {
          botResponse = "Je n'ai pas encore assez de données de ventes pour identifier vos meilleurs produits.";
        }
      }
      else if (lowerContent.includes("clients") && (lowerContent.includes("meilleurs") || lowerContent.includes("top"))) {
        const { data } = await api.get('/chatbot/orders/top-customers?limit=5');
        if (data.length > 0) {
          const list = data.map((c: any, i: number) => `${i + 1}. **${c.customer_name}** (${c.order_count} commandes)`).join("\n");
          botResponse = `Vos clients les plus fidèles sont :\n\n${list}\n\nIls méritent peut-être un petit geste commercial !`;
        } else {
          botResponse = "Je n'ai pas trouvé assez d'historique de commandes pour lister vos meilleurs clients.";
        }
      }
      else if (lowerContent.includes("retours")) {
        const { data } = await api.get('/chatbot/returns/top?limit=3');
        if (data.length > 0) {
          const list = data.map((c: any, i: number) => `• **${c.customer_name}** : ${c.count} retours`).join("\n");
          botResponse = `Attention, voici les clients ayant effectué le plus de retours :\n\n${list}\n\nIl serait peut-être utile de vérifier les raisons de ces retours avec eux.`;
        } else {
          botResponse = "Bonne nouvelle ! Aucun retour significatif n'a été enregistré récemment.";
        }
      }
      else {
        // Fallback for general questions
        botResponse = "C'est une question intéressante ! Pour l'instant, je peux surtout vous aider avec vos chiffres de vente, vos top produits/clients et vos retours. Essayez de me poser une question plus spécifique sur vos performances.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, j'ai rencontré une difficulté technique en essayant de récupérer vos données. Veuillez vérifier que votre connexion au serveur est active.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
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
              <h1 className="text-xl font-black m-0 leading-tight tracking-tight uppercase text-white">MyStore Agent</h1>
              <p className="text-slate-400 text-sm m-0 flex items-center gap-1 font-bold">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                Assistant Connecté • Données Réelles
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
                <div className={`p-4 rounded-2xl shadow-md text-base leading-relaxed font-bold whitespace-pre-wrap ${
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
                  <span className="text-xs text-slate-500 font-black">L'agent analyse vos données...</span>
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
