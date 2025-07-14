'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, Code, PanelLeftClose, Plus, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  onHtmlGenerated: (html: string) => void;
}

interface Session {
  id: string;
  createdAt: string;
}

export default function ChatInterface({ onHtmlGenerated }: ChatInterfaceProps) {
  const [styleOption, setStyleOption] = useState('inline');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    append,
    setMessages
  } = useChat({
    api: '/api/chat',
    body: { styleOption, sessionId: selectedSession },
    onFinish: (message) => {
      if (message.content) onHtmlGenerated(message.content);
    },
  });

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetch(`/api/messages?sessionId=${selectedSession}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [selectedSession,setMessages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Sidebar - Collapsible */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <div className="w-72 h-full flex flex-col border-r border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Sessions
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={async () => {
                  const res = await fetch('/api/sessions', { method: 'POST' });
                  const newSession = await res.json();
                  setSessions(prev => [newSession, ...prev]);
                  setSelectedSession(newSession.id);
                }}
                className="text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <PanelLeftClose className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {sessions.length === 0 ? (
              <div className="text-center p-4 text-sm text-gray-400">
                No sessions yet. Create one to start.
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSession(s.id)}
                    className={`w-full text-left px-3 py-3 rounded-md text-sm transition-all ${
                      selectedSession === s.id 
                        ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/30 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                      <span className="truncate">{new Date(s.createdAt).toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                <PanelLeftClose className="w-5 h-5 rotate-180" />
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                HTML Generator
              </h1>
            </div>
          </div>
          <Select value={styleOption} onValueChange={setStyleOption}>
            <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Style option" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {/* <SelectItem value="tailwind" className="hover:bg-gray-700 focus:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>Tailwind CSS</span>
                </div>
              </SelectItem> */}
              <SelectItem value="inline" className="hover:bg-gray-700 focus:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>Inline Styles</span>
                </div>
              </SelectItem>
              <SelectItem value="style-tag" className="hover:bg-gray-700 focus:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-green-400" />
                  <span>Style Tags</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-900 to-gray-800/80">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="max-w-2xl w-full bg-gray-800/70 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">HTML Generation AI</h3>
                  <p className="text-gray-300 mb-6">
  Describe the webpage you want to create and I&apos;ll generate the HTML code for you.
  <br />
  Choose your preferred styling method above.
</p>

                  {!selectedSession && (
                    <Button 
                      onClick={async () => {
                        const res = await fetch('/api/sessions', { method: 'POST' });
                        const newSession = await res.json();
                        setSessions(prev => [newSession, ...prev]);
                        setSelectedSession(newSession.id);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start New Session
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-gray-800/80 border border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-1.5 rounded-full ${
                    message.role === 'user' 
                      ? 'bg-blue-800/50 text-blue-100' 
                      : 'bg-gray-700 text-purple-400'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                <div className="text-sm">
                  {message.role === 'assistant' ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-900/80 p-4 rounded-lg border border-gray-700 overflow-x-auto text-gray-200">
                      {message.content}
                    </pre>
                  ) : (
                    <p className="whitespace-pre-wrap text-gray-100">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl rounded-2xl px-5 py-4 bg-gray-800/80 border border-gray-700 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-1.5 rounded-full bg-gray-700 text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse delay-75"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input - Now with 100% more visibility */}
        <div className="p-4 border-t absolute bottom-[30px] border-gray-700 bg-gray-800/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={selectedSession 
                ? "Describe your webpage (e.g. &apos;Create a login form with gradient background&apos;)" 
                : "Create a session to start chatting..."}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 rounded-xl px-4 py-3 transition-all"
              disabled={isLoading || !selectedSession}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim() || !selectedSession}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg disabled:opacity-50 disabled:pointer-events-none px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}