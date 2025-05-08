import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const p = await params;
    const postId = parseInt(p.postId, 10);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "You already liked this post" },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json({ like }, { status: 201 });
  } catch (error) {
    console.error("Error creating like:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const p = await params;
    const postId = parseInt(p.postId, 10);
    const like = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: "Like record not found" },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    return NextResponse.json(
      { message: "Like removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json(
      { error: "Failed to remove like" },
      { status: 500 }
    );
  }
}
