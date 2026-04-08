"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepView from "@/components/StepView";
import { formatDuration } from "@/lib/scheduler";
import type { BatchSession, CookingMode } from "@/lib/types";

function SessionContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");

  const [session, setSession] = useState<BatchSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode] = useState<CookingMode>("normal");

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      setSession(data.session);
    } catch {
      console.error("Failed to fetch session");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const startSession = async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    });
    const data = await res.json();
    setSession(data.session);
  };

  const advanceStep = async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/sessions/${sessionId}/step`, {
      method: "POST",
    });
    const data = await res.json();
    // Refetch full session to get updated tasks
    await fetchSession();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🍳</div>
          <p className="text-gray-500">Chargement de ta session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aucune session en cours
          </h2>
          <p className="text-gray-500 mb-6">
            Choisis tes recettes pour lancer une session batch cooking.
          </p>
          <a
            href="/recettes"
            className="inline-block px-6 py-3 bg-chef-500 text-white rounded-xl font-semibold hover:bg-chef-600 transition-colors"
          >
            Choisir mes recettes
          </a>
        </div>
      </div>
    );
  }

  // Session completed
  if (session.status === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Session terminée !
          </h2>
          <p className="text-gray-600 mb-2">
            {session.recipeIds.length} repas préparés pour la semaine.
          </p>
          <p className="text-sm text-sage-600 font-medium mb-6">
            Budget maîtrisé, zéro stress.
          </p>
          <a
            href="/recettes"
            className="inline-block px-6 py-3 bg-chef-500 text-white rounded-xl font-semibold hover:bg-chef-600 transition-colors"
          >
            Prochaine session
          </a>
        </div>
      </div>
    );
  }

  // Session planning — not yet started
  if (session.status === "planning") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">👨‍🍳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ta session est prête
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Durée estimée</span>
              <span className="font-bold text-gray-900">
                {formatDuration(session.estimatedTotalMinutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nombre d&apos;étapes</span>
              <span className="font-bold text-gray-900">{session.tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Recettes</span>
              <span className="font-bold text-gray-900">{session.recipeIds.length}</span>
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full py-4 bg-chef-500 text-white rounded-xl font-bold text-lg hover:bg-chef-600 active:bg-chef-700 transition-colors shadow-lg shadow-chef-500/25"
          >
            C&apos;est parti !
          </button>

          <p className="mt-3 text-xs text-gray-400">
            Tu peux faire une pause à tout moment
          </p>
        </div>
      </div>
    );
  }

  // Active session — show current task
  const currentTask = session.tasks[session.currentTaskIndex];
  if (!currentTask) return null;

  return (
    <StepView
      task={currentTask}
      mode={mode}
      stepNumber={session.currentTaskIndex + 1}
      totalSteps={session.tasks.length}
      onComplete={advanceStep}
      onSkip={advanceStep}
    />
  );
}

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-4xl animate-bounce">🍳</div>
        </div>
      }
    >
      <SessionContent />
    </Suspense>
  );
}
