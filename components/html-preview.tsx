'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, Code, Download, RefreshCw } from 'lucide-react';

interface HtmlPreviewProps {
  html: string;
}

export default function HtmlPreview({ html }: HtmlPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const refreshPreview = () => {
    // Force refresh of iframe
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Live Preview</span>
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <Button
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('preview')}
                className="h-7"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('code')}
                className="h-7"
              >
                <Code className="w-4 h-4 mr-1" />
                Code
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={refreshPreview}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadHtml}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="h-full">
            {html ? (
              <iframe
                id="preview-iframe"
                srcDoc={html}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
                title="HTML Preview"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Preview Available</h3>
                  <p className="text-sm">Generate HTML code to see the preview here</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-4">
            {html ? (
              <pre className="h-full overflow-auto bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono">
                <code>{html}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Code Available</h3>
                  <p className="text-sm">Generate HTML code to see it here</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}