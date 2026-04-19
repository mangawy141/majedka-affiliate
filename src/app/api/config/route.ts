import { NextResponse } from "next/server";
import { getAllQuestions } from "@/lib/services/questions.service";
import { getAllSocialMediaLinks } from "@/lib/services/social-media.service";

export async function GET() {
  try {
    const [questions, socialLinks] = await Promise.all([
      getAllQuestions(),
      getAllSocialMediaLinks(),
    ]);

    return NextResponse.json({
      questions,
      socialLinks,
    });
  } catch (error) {
    console.error("Error fetching site config:", error);
    return NextResponse.json(
      { error: "Failed to fetch site config" },
      { status: 500 }
    );
  }
}
