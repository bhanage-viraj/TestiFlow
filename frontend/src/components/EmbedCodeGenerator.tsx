'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface EmbedCodeGeneratorProps {
  spaceSlug: string;
  baseUrl: string;
}

export default function EmbedCodeGenerator({ spaceSlug, baseUrl }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const publicUrl = `${baseUrl}/t/${spaceSlug}`;
  
  const htmlEmbedCode = `<div id="testiflow-widget-${spaceSlug}"></div>
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = '${baseUrl}/embed/${spaceSlug}';
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('testiflow-widget-${spaceSlug}').appendChild(iframe);
  })();
</script>`;

  const reactEmbedCode = `import { useEffect, useRef } from 'react';

export default function TestimonialWidget() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = '${baseUrl}/embed/${spaceSlug}';
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: '100%',
        height: '400px',
        border: 'none',
        borderRadius: '8px'
      }}
    />
  );
}`;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard.`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Embed Code
        </CardTitle>
        <CardDescription>
          Add testimonials to your website using these embed codes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Public URL */}
        <div>
          <Label>Public Testimonial Page</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={publicUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(publicUrl, 'URL')}
            >
              {copied === 'URL' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(publicUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* HTML Embed */}
        <div>
          <Label>HTML Embed Code</Label>
          <div className="mt-1">
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {htmlEmbedCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleCopy(htmlEmbedCode, 'HTML')}
            >
              {copied === 'HTML' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy HTML Code
            </Button>
          </div>
        </div>

        {/* React Embed */}
        <div>
          <Label>React Component</Label>
          <div className="mt-1">
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {reactEmbedCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleCopy(reactEmbedCode, 'React')}
            >
              {copied === 'React' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy React Code
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Copy the embed code above</li>
            <li>2. Paste it into your website's HTML or React component</li>
            <li>3. The testimonials will automatically load and display</li>
            <li>4. Users can submit new testimonials through the widget</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
