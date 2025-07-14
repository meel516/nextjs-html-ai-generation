'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Code, Download, RefreshCw } from 'lucide-react';

interface HtmlPreviewProps {
  html: string;
}

export default function HtmlPreview({ html }: HtmlPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  // Extract pure HTML from the LLM response (optional: keep if your HTML comes wrapped in extra content)
  const extractPureHtml = (rawHtml: string) => {
    const htmlStart = rawHtml.indexOf('<!DOCTYPE html>');
    const htmlEnd = rawHtml.lastIndexOf('</html>') + 7;
    return htmlStart !== -1 && htmlEnd !== -1
      ? rawHtml.slice(htmlStart, htmlEnd)
      : rawHtml;
  };

  // Memoize the pure HTML string
  const pureHtml = useMemo(() => extractPureHtml(html), [html]);

  // Generate a blob URL whenever pureHtml changes
  useEffect(() => {
    if (!pureHtml) return;

    const blob = new Blob([pureHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);

    return () => {
      URL.revokeObjectURL(url); // clean up when component unmounts or html changes
    };
  }, [pureHtml]);

  // Refresh iframe by regenerating the blob URL
  const refreshPreview = () => {
    setIsRefreshing(true);

    const blob = new Blob([pureHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Download HTML as a file
  const downloadHtml = () => {
    const blob = new Blob([pureHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l">
      {/* Header */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium flex items-center">
            <span>HTML Output</span>
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('preview')}
              className="h-8 px-3"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Preview
            </Button>
            <Button
              variant={viewMode === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('code')}
              className="h-8 px-3"
            >
              <Code className="w-4 h-4 mr-1.5" />
              Code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshPreview}
              className="h-8 px-3"
              disabled={!pureHtml}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadHtml}
              className="h-8 px-3"
              disabled={!pureHtml}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {viewMode === 'preview' ? (
          <div className="h-full">
            {iframeUrl ? (
              <iframe
                id="preview-iframe"
                src={iframeUrl}
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin"
                title="HTML Preview"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Generated HTML will appear here</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-0">
            {pureHtml ? (
              <pre className="h-full overflow-auto p-4 text-sm font-mono text-gray-800 bg-gray-50">
                <code>{pureHtml}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Code className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Generated code will appear here</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
