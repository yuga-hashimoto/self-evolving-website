"use client";

import { useState, useEffect, useRef } from "react";
import { IconMimo, IconClick, IconLoading, IconBrain, IconCodeSpark } from "@/components/icons/Icons";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  type?: "text" | "code" | "success";
}

interface InteractivePlaygroundProps {
  onStart: () => void;
  onMessageSend: (message: string) => void;
}

export default function InteractivePlayground({ onStart, onMessageSend }: InteractivePlaygroundProps) {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Preset prompts for quick start
  const presetPrompts = [
    "HTML/CSS/JSを学ぶべき理由",
    "ReactとVueの比較",
    "AIエンジニアになるには",
    "ポートフォリオの作り方",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStart = () => {
    setStarted(true);
    setShowWelcome(false);
    onStart();

    // Initial AI message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "ai",
        content: "こんにちは！私はMiMoです。何でも気軽に質問してください。コードの生成、技術的な相談、キャリアのアドバイスなど、なんでもお手伝いします！",
        timestamp: new Date(),
        type: "text"
      }]);
    }, 500);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onMessageSend(inputValue);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      const responses = [
        {
          content: "素晴らしい質問ですね！それについて詳しく解説します。まず、基本的な概念として...",
          type: "text" as const
        },
        {
          content: "```javascript\n// コード例\nfunction example() {\n  console.log('Hello World');\n  return true;\n}\n```",
          type: "code" as const
        },
        {
          content: "💡 ポイント：このアプローチを使うと、効率的に問題を解決できます。実践してみてください！",
          type: "success" as const
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "ai",
        content: randomResponse.content,
        timestamp: new Date(),
        type: randomResponse.type
      }]);

      setIsLoading(false);
    }, 1500 + Math.random() * 1000); // Random delay for realism
  };

  const handlePresetClick = (prompt: string) => {
    setInputValue(prompt);
    handleStart();
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!started) {
    return (
      <div className="glass-card p-8 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center mb-4">
          <IconMimo size={64} className="animate-pulse-glow" />
        </div>
        <h2 className="text-2xl font-bold text-white">MiMo AI と対話しよう</h2>
        <p className="text-gray-300">
          即座に回答を得たり、コードを生成したり、キャリアの相談ができます。<br />
          以下の例から始めるか、自由に質問してください。
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {presetPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(prompt)}
              className="glass-card p-4 hover:bg-white/10 transition-all text-left hover:translate-x-1"
            >
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <IconClick size={14} />
                <span className="text-xs font-bold">クイックスタート</span>
              </div>
              <div className="font-medium text-white">{prompt}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <IconBrain size={18} />
          自由に質問する
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col h-[500px] sm:h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <IconMimo size={24} />
          <span className="font-bold">MiMo AI チャット</span>
          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">稼働中</span>
        </div>
        <button
          onClick={() => setStarted(false)}
          className="text-xs text-gray-400 hover:text-white hover:underline"
        >
          新しいチャット
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : msg.type === "code"
                    ? "bg-gray-900 text-green-400 font-mono text-sm border border-green-500/30"
                    : msg.type === "success"
                      ? "bg-green-500/20 text-white border border-green-500/40"
                      : "bg-white/10 text-gray-200"
              }`}
            >
              {msg.type === "code" ? (
                <pre className="whitespace-pre-wrap">{msg.content}</pre>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
              <div className={`text-[10px] mt-1 ${msg.role === "user" ? "text-purple-200" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
              <IconLoading size={20} className="animate-spin" />
              <span className="text-sm text-gray-300">MiMoが考え中...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="MiMoに質問する... (Enterで送信)"
            className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 resize-none h-12 sm:h-14"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className={`px-4 sm:px-6 rounded-lg font-bold transition-all ${
              isLoading || !inputValue.trim()
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-purple-600 hover:bg-purple-500 hover:scale-105 active:scale-95"
            }`}
          >
            {isLoading ? <IconLoading size={20} className="animate-spin" /> : <IconClick size={20} />}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-2 text-xs text-gray-400 flex gap-2 flex-wrap">
          <span>💡 例:</span>
          {presetPrompts.slice(0, 2).map((tip, idx) => (
            <button
              key={idx}
              onClick={() => setInputValue(tip)}
              className="hover:text-white hover:underline"
            >
              {tip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}