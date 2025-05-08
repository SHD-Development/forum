import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ isLiked: false }, { status: 200 });
    }

    const userId = session.user.id;
    const p = await params;
    const postId = parseInt(p.postId, 10);

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    return NextResponse.json({ isLiked: !!existingLike }, { status: 200 });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Failed to check like status", isLiked: false },
      { status: 500 }
    );
  }
}
