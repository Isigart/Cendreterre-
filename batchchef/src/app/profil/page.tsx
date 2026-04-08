"use client";

import { useState } from "react";
import type { CookingMode } from "@/lib/types";

export default function ProfilPage() {
  const [mode, setMode] = useState<CookingMode>("normal");
  const [householdSize, setHouseholdSize] = useState(2);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Personnalise ton expérience BatchChef
        </p>
      </div>

      {/* Cooking mode */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900">Mode de cuisine</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("normal")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              mode === "normal"
                ? "border-chef-500 bg-chef-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-2">🍴</div>
            <div className="font-semibold text-sm">Normal</div>
            <div className="text-xs text-gray-500 mt-1">
              Instructions concises, astuces techniques
            </div>
          </button>
          <button
            onClick={() => setMode("guided")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              mode === "guided"
                ? "border-chef-500 bg-chef-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-2">👶</div>
            <div className="font-semibold text-sm">Guidé</div>
            <div className="text-xs text-gray-500 mt-1">
              Instructions détaillées, réassurance
            </div>
          </button>
        </div>
      </div>

      {/* Household size */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900">Nombre de personnes</h2>
        <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
          <button
            onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-lg"
          >
            -
          </button>
          <span className="text-2xl font-bold flex-1 text-center">
            {householdSize}
          </span>
          <button
            onClick={() => setHouseholdSize(Math.min(12, householdSize + 1))}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900">Abonnement</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Statut</span>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Essai gratuit
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Prix</span>
            <span className="font-bold">9€/mois</span>
          </div>
          <button className="w-full py-3 bg-chef-500 text-white rounded-xl font-semibold hover:bg-chef-600 transition-colors">
            Gérer mon abonnement
          </button>
        </div>
      </div>

      {/* Save button */}
      <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
        Sauvegarder
      </button>
    </div>
  );
}
