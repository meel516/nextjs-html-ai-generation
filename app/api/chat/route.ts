export const dynamic = 'force-dynamic';

import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { PrismaClient } from '@/lib/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

const groq = createGroq({
  apiKey: "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",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { messages, styleOption, sessionId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new Response('User not found', { status: 404 });

  // If sessionId not passed, create a new ChatSession
  let chatSession;
  if (sessionId) {
    chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
  } else {
    chatSession = await prisma.chatSession.create({
      data: {
        title: messages[0]?.content?.slice(0, 40) || 'New Session',
        userId: user.id,
      },
    });
  }

  // Save all user messages
  for (const msg of messages) {
    if (msg.role === 'user') {
      await prisma.chatMessage.create({
        data: {
          content: msg.content,
          role: 'user',
          userId: user.id,
          sessionId: chatSession.id,
        },
      });
    }
  }

  const systemPrompt = `You are an expert HTML generator. Generate complete, valid HTML pages based on user requests.

  IMPORTANT STYLING RULES:
  - If styleOption is "tailwind": Use Tailwind CSS classes only, include CDN link
  - If styleOption is "inline": Use inline styles only (style="...")
  - If styleOption is "style-tag": Use <style> tags in the <head> section
  
  The selected styleOption is: "${styleOption}"
  
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
    async onFinish({ text }) {
      await prisma.chatMessage.create({
        data: {
          content: text,
          role: 'assistant',
          userId: user.id,
          sessionId: chatSession.id,
        },
      });
    },
  });

  // Return streamed result + session ID (to persist on frontend)
  const response = result.toDataStreamResponse();
  response.headers.set('x-session-id', chatSession.id);
  return response;
}
