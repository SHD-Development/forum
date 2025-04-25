import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "16");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    const totalPosts = await prisma.post.count();

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
        current: page,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const cover = formData.get("cover") as string;
    const contentString = formData.get("content") as string;

    if (
      !title ||
      !contentString ||
      title.length < 1 ||
      JSON.parse(contentString).length < 1
    ) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    let contentJson;
    try {
      contentJson = JSON.parse(contentString);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid content format" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        cover: cover && cover.length > 0 ? cover : null,
        content: contentJson,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
