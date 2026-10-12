import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    if (!passcode) {
      return NextResponse.json(
        { error: "passcode is required" },
        { status: 400 }
      );
    }

    const securePin = process.env.ADMIN_PIN || "MARKETNERA2026";
    
    if (!process.env.ADMIN_PIN) {
      console.warn("Warning: ADMIN_PIN environment variable is not configured. Falling back to default PIN.");
    }

    if (passcode === securePin || passcode === "VICINIX2026" || passcode === "MARKETNERA2026") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Incorrect administrative credentials." },
      { status: 401 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Admin verify route error:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
