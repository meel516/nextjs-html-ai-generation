export const dynamic = 'force-dynamic';

import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, styleOption } = await req.json();

    const systemPrompt = `You are an expert HTML generator. Generate complete, valid HTML pages based on user requests.

IMPORTANT STYLING RULES:
- If styleOption is "tailwind": Use Tailwind CSS classes only, include CDN link
- If styleOption is "inline": Use inline styles only (style="...")
- If styleOption is "style-tag": Use <style> tags in the <head> section

Always generate:
1. Complete HTML structure with <!DOCTYPE html>, <html>, <head>, and <body>
2. Responsive design that works on all devices
3. Clean, modern styling appropriate to the request
4. Semantic HTML elements
5. Proper meta tags and title

For Tailwind option, always include:
<script src="https://cdn.tailwindcss.com"></script>

Return ONLY the HTML code, no explanations or markdown formatting.`;

    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 4096,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Error processing request', { status: 500 });
  }
}