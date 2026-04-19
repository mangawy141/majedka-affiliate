import { NextRequest, NextResponse } from "next/server";
import {
  getAllSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
} from "@/lib/services/social-media.service";
import { z } from "zod";

const createSocialMediaLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Invalid URL"),
  icon: z.string().optional(),
  order: z.number().int().nonnegative(),
});

export async function GET() {
  try {
    const links = await getAllSocialMediaLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching social media links:", error);
    return NextResponse.json(
      { error: "Failed to fetch social media links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSocialMediaLinkSchema.parse(body);

    const link = await createSocialMediaLink({
      ...validated,
      icon: validated.icon || null,
      isActive: true,
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.format() },
        { status: 400 }
      );
    }
    console.error("Error creating social media link:", error);
    return NextResponse.json(
      { error: "Failed to create social media link" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 }
      );
    }

    const link = await updateSocialMediaLink(id, data);
    return NextResponse.json(link);
  } catch (error) {
    console.error("Error updating social media link:", error);
    return NextResponse.json(
      { error: "Failed to update social media link" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 }
      );
    }

    await deleteSocialMediaLink(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting social media link:", error);
    return NextResponse.json(
      { error: "Failed to delete social media link" },
      { status: 500 }
    );
  }
}
