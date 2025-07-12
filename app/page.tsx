'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat-interface';
import HtmlPreview from '@/components/html-preview';

export default function Home() {
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handleHtmlGenerated = (html: string) => {
    setGeneratedHtml(html);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HTML Page Generator</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create beautiful HTML pages with AI assistance using Groq and Vercel AI SDK
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-1/2 border-r border-gray-200">
          <ChatInterface onHtmlGenerated={handleHtmlGenerated} />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2">
          <HtmlPreview html={generatedHtml} />
        </div>
      </div>
    </div>
  );
}