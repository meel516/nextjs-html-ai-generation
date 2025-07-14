'use client';
import { useEffect, useLayoutEffect, useState } from "react";
import ChatInterface from "./chat-interface";
import HtmlPreview from "./html-preview";
import { Eye } from "lucide-react"

export default function ChatWrapper() {
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [showPreview, setShowPreview] = useState(true)
  const handleHtmlGenerated = (html: string) => {
    setGeneratedHtml(html);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480 && !showPreview) {
        setShowPreview(true);
      }
    };
  
    // Initial check
    handleResize();
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showPreview]);


  return (
    <div className="flex-1 gap-2 grid grid-cols-12 overflow-hidden relative">
      <div className="col-span-12 sm:col-span-5 border-r border-gray-200">
        <ChatInterface onHtmlGenerated={handleHtmlGenerated} />
      </div>
      <div className="block sm:none absolute top-3 right-3" onClick={() => {

        setShowPreview(true)
      }}><Eye color="white" /></div>
      {showPreview ? <div className="col-span-12 sm:col-span-6 absolute h-screen z-10 inset-0 backdrop-blur-sm p-10 sm:p-0  bg-blue sm:left-auto sm:top-auto sm:static">
        <HtmlPreview html={generatedHtml} onClose={() => {

          setShowPreview(false)
        }} />
      </div> : null}
    </div>
  )
}