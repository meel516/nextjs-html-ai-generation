'use client';
import { useState } from "react";
import ChatInterface from "./chat-interface";
import HtmlPreview from "./html-preview";

export default function ChatWrapper() {
  const [generatedHtml, setGeneratedHtml] = useState('');
  const handleHtmlGenerated = (html: string) => {
    setGeneratedHtml(html);
  };


  return (
    <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-200">
          <ChatInterface onHtmlGenerated={handleHtmlGenerated} />
        </div>
        <div className="w-1/2">
          <HtmlPreview html={generatedHtml} />
        </div>
      </div>
  )
}