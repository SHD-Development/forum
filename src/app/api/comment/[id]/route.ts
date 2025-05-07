import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const commentId = parseInt(p.id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const p = await params;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = parseInt(p.id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to update this comment" },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...updatedComment,
      createdAt: updatedComment.createdAt.toISOString(),
      updatedAt: updatedComment.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const p = await params;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = parseInt(p.id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this comment" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
