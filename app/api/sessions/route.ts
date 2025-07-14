import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const sessions = await prisma.chatSession.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true,createdAt:true },
  });

  return Response.json(sessions);
}
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  
    let body = {};
    try {
      body = await req.json(); // 👈 only if there's a body
    } catch (err) {
      // No body or invalid JSON — continue with default values
    }
  
    const title = (body as any).title || 'Untitled Chat';
  
    const chatSession = await prisma.chatSession.create({
      data: {
        title,
        user: { connect: { email: session.user.email } },
      },
    });
  
    return Response.json(chatSession);
  }
  