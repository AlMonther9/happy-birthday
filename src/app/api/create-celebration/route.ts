import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create a unique URL for this celebration
    const celebrationUrl = `/celebration/${encodeURIComponent(name)}`;

    return NextResponse.json({
      success: true,
      url: celebrationUrl,
      message: `Celebration created for ${name}`,
    });
  } catch (error) {
    console.error("Error creating celebration:", error);
    return NextResponse.json(
      { error: "Failed to create celebration" },
      { status: 500 }
    );
  }
}
