import { getServerSession } from "next-auth";
import { PrismaClient } from '@/lib/generated/prisma';
import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();


export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const { searchParams } = new URL(req.url);
      const sessionId = searchParams.get('sessionId');
  
      if (!session?.user?.email || !sessionId) {
        return new Response("Unauthorized", { status: 401 });
      }
  
      const messages = await prisma.chatMessage.findMany({
        where: {
          sessionId,
          user: { email: session.user.email },
        },
        orderBy: { createdAt: 'asc' },
      });
  
      return Response.json(messages);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  