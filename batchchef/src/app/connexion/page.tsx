"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConnexionPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with NextAuth signIn
    console.log("Auth:", { email, password, name, isSignUp });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🍳</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp
              ? "2 semaines d'essai gratuit"
              : "Content de te revoir !"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-chef-500 focus:ring-1 focus:ring-chef-500 outline-none transition-colors"
                placeholder="Marie"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-chef-500 focus:ring-1 focus:ring-chef-500 outline-none transition-colors"
              placeholder="marie@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-chef-500 focus:ring-1 focus:ring-chef-500 outline-none transition-colors"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-chef-500 text-white rounded-xl font-bold text-lg hover:bg-chef-600 active:bg-chef-700 transition-colors"
          >
            {isSignUp ? "Commencer l'essai gratuit" : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-chef-600 hover:text-chef-700"
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Pas de compte ? Créer un compte"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
