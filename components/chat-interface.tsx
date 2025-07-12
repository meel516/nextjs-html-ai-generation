'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, Code, Eye } from 'lucide-react';

interface ChatInterfaceProps {
  onHtmlGenerated: (html: string) => void;
}

export default function ChatInterface({ onHtmlGenerated }: ChatInterfaceProps) {
  const [styleOption, setStyleOption] = useState('tailwind');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { styleOption },
    onFinish: (message) => {
      if (message.content) {
        onHtmlGenerated(message.content);
      }
    },
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">HTML Generator</h2>
          </div>
          <Select value={styleOption} onValueChange={setStyleOption}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tailwind">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Tailwind CSS</span>
                </div>
              </SelectItem>
              <SelectItem value="inline">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Inline Styles</span>
                </div>
              </SelectItem>
              <SelectItem value="style-tag">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Style Tags</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to HTML Generator</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Describe the webpage you want to create and I'll generate the HTML code for you. 
              Choose your preferred styling option above.
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {message.role === 'user' ? 'You' : 'AI'}
                </span>
              </div>
              <div className="text-sm">
                {message.role === 'assistant' ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                    {message.content}
                  </pre>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">AI</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Describe the webpage you want to create..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}