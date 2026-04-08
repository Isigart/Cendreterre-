import { NextResponse } from "next/server";
import { advanceTask, getSession } from "@/lib/sessions";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await advanceTask(params.id);
    if (!session) {
      return NextResponse.json(
        { error: "Impossible de passer à l'étape suivante" },
        { status: 400 }
      );
    }

    const currentTask =
      session.currentTaskIndex < session.tasks.length
        ? session.tasks[session.currentTaskIndex]
        : null;

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        currentTaskIndex: session.currentTaskIndex,
        totalTasks: session.tasks.length,
        currentTask,
        completedAt: session.completedAt,
      },
    });
  } catch (error) {
    console.error("Error advancing step:", error);
    return NextResponse.json(
      { error: "Erreur lors du passage à l'étape suivante" },
      { status: 500 }
    );
  }
}

// GET current step info
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

    const currentTask =
      session.currentTaskIndex < session.tasks.length
        ? session.tasks[session.currentTaskIndex]
        : null;

    return NextResponse.json({
      currentTaskIndex: session.currentTaskIndex,
      totalTasks: session.tasks.length,
      currentTask,
      status: session.status,
      estimatedTotalMinutes: session.estimatedTotalMinutes,
    });
  } catch (error) {
    console.error("Error fetching step:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de l'étape" },
      { status: 500 }
    );
  }
}
