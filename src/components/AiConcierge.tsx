"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, MessageSquare } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AiConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "AIツールをお探しですか？私が最適なツールを提案します。" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    // AI Mock Response (Jules would implement real logic here)
    setTimeout(() => {
      const responses = [
        "それなら [Claude](https://claude.ai) がおすすめです。コーディング能力が非常に高いです。",
        "画像生成なら [Midjourney](https://midjourney.com) が現在最強です。",
        "動画生成なら [Runway Gen-3](https://runwayml.com) を試してみてください。",
        "ビジネス用途なら [Gemini Advanced](https://gemini.google.com) がGoogleエコシステムと連携して便利です。",
        "オープンソースなら [Hugging Face](https://huggingface.co) でモデルを探すと良いでしょう。"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none transition-all duration-500 ease-in-out`}>
        {/* Chat Window */}
        <div 
          className={`
            pointer-events-auto transition-all duration-300 origin-bottom-right
            bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden
            flex flex-col mb-4 w-[350px] max-w-[calc(100vw-2rem)]
            ${isOpen ? "scale-100 opacity-100 h-[500px]" : "scale-0 opacity-0 h-0"}
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>AI Concierge</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${
                    msg.role === "user" 
                      ? "bg-violet-600 text-white rounded-br-none" 
                      : "bg-white/10 text-slate-200 rounded-bl-none border border-white/5"
                  }`}
                >
                  <p dangerouslySetInnerHTML={{ 
                    __html: msg.content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-blue-300 hover:text-blue-200 font-medium">$1</a>') 
                  }} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl p-4 rounded-bl-none border border-white/5 flex gap-1 items-center h-10">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="どんなツールをお探しですか？"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-white/30 transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all shadow-lg hover:shadow-violet-500/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            pointer-events-auto
            bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-violet-500/50 transition-all duration-300 hover:scale-110 active:scale-95
            flex items-center justify-center
            ${isOpen ? "opacity-0 scale-0 absolute pointer-events-none" : "opacity-100 scale-100"}
          `}
          aria-label="Toggle AI Concierge"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
