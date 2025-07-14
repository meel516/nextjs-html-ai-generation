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
  let chatSession:any;
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

  STYLING RULES:
  - If styleOption is "inline": Use inline styles only (e.g., style="...")
  - If styleOption is "style-tag": Use <style> tags in the <head> section
  
  ALWAYS follow these performance and best-practice rules:
  1. Use <img loading="lazy"> for all images.
  2. Always use <script defer> for all JavaScript scripts.
  3. Include essential meta tags for responsiveness and rendering:
     - <meta charset="UTF-8">
     - <meta name="viewport" content="width=device-width, initial-scale=1.0">
  4. Use semantic HTML elements: <header>, <main>, <section>, <footer>, etc.
  5. Ensure all pages are mobile-friendly and responsive.
  6. Minimize unnecessary markup or libraries.
  
  Always generate:
  - A complete HTML document including <!DOCTYPE html>, <html>, <head>, and <body>
  - Clean, readable, and valid HTML5 code
  - No markdown, comments, or extra explanations — return ONLY the HTML code`;
  
  

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
