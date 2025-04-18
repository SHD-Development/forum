import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to get posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, authorId } = await request.json();

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Required parameters not provided." },
        { status: 400 }
      );
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { error: "User with provided authorId not found." },
        { status: 404 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    );
  }
}
