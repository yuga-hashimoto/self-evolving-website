"use client";

import { useState, useEffect, useRef } from "react";
import { IconBrain, IconCodeSpark } from "../../../../../components/icons/Icons";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  typing?: boolean;
}

const exampleConversations = [
  {
    user: "What's the meaning of life?",
    assistant: "As an AI built by xAI, I think the meaning of life might be to understand the universe and make it better. What do you think?"
  },
  {
    user: "How does photosynthesis work?",
    assistant: "Photosynthesis is nature's solar-powered biochemistry! Plants capture light energy with chlorophyll, use CO₂ from air and water from soil to create glucose (food) and oxygen. It's basically turning sunlight into life fuel. Pretty amazing, right?"
  },
  {
    user: "Explain quantum computing in simple terms",
    assistant: "Quantum computing uses quantum bits (qubits) that can be both 0 and 1 at once. Unlike regular computers that process bits sequentially, quantum computers can explore multiple solutions simultaneously. It's like having thousands of parallel universes working on your problem!"
  },
  {
    user: "What's the most efficient way to learn programming?",
    assistant: "The most efficient way? Build real projects you're passionate about. Start small (Hello World), then create something useful. Debug, refactor, repeat. Mix theory with practice - read docs while building. And don't fear Google/Friends - programming is problem-solving, not memorization."
  }
];

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = async (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const playDemo = async () => {
    if (currentDemo >= exampleConversations.length) return;

    const demo = exampleConversations[currentDemo];

    // Add user message
    await addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: demo.user
    });

    // Simulate typing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);

    // Add assistant message with typing effect
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: demo.assistant,
      typing: true
    };

    await addMessage(assistantMessage);

    // Simulate gradual reveal
    let revealedChars = 0;
    const targetText = demo.assistant;
    const interval = setInterval(() => {
      revealedChars = Math.min(revealedChars + 1, targetText.length);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessage.id
          ? { ...msg, content: targetText.slice(0, revealedChars), typing: revealedChars < targetText.length }
          : msg
      ));

      if (revealedChars >= targetText.length) {
        clearInterval(interval);
      }
    }, 30);

    setCurrentDemo(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: currentInput
      });
      setCurrentInput('');

      // Simulate response
      setTimeout(() => {
        playDemo();
      }, 500);
    }
  };

  useEffect(() => {
    // Auto-start with first demo
    setTimeout(() => playDemo(), 2000);
  }, []);

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl p-6 mb-8">
      <div className="flex items-center justify-center mb-4">
        <IconBrain size={32} className="text-blue-400 mr-2" />
        <h3 className="text-xl font-semibold text-white">Try Grok - Examples</h3>
      </div>

      {/* Chat messages */}
      <div className="h-80 overflow-y-auto bg-gray-800/50 rounded-lg p-4 mb-4 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-100'
            }`}>
              {msg.content}
              {msg.typing && (
                <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-left">
            <div className="inline-block bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
              <IconBrain size={16} className="inline animate-pulse mr-1" />
              Grok is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Ask Grok anything..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!currentInput.trim() || isTyping}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <IconCodeSpark size={16} />
          Ask
        </button>
      </form>

      <div className="mt-3 text-center">
        <button
          onClick={playDemo}
          disabled={isTyping || currentDemo >= exampleConversations.length}
          className="text-blue-400 hover:text-blue-300 text-sm underline disabled:text-gray-500 disabled:no-underline"
        >
          {currentDemo >= exampleConversations.length ? 'Demo finished' : 'Show next example'}
        </button>
      </div>
    </div>
  );
}