import { NextResponse } from "next/server";
import { getSession, startSession, pauseSession, resumeSession } from "@/lib/sessions";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(params.id);
    if (!session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 404 }
      );
    }
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Impossible de charger la session" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action } = body;

    let session;
    switch (action) {
      case "start":
        session = await startSession(params.id);
        break;
      case "pause":
        session = await pauseSession(params.id);
        break;
      case "resume":
        session = await resumeSession(params.id);
        break;
      default:
        return NextResponse.json(
          { error: "Action invalide" },
          { status: 400 }
        );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Impossible de modifier la session" },
        { status: 400 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
