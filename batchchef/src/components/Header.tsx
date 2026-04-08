"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍳</span>
          <span className="font-bold text-lg text-gray-900">BatchChef</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/recettes" className="text-sm text-gray-600 hover:text-chef-600 transition-colors">
            Recettes
          </Link>
          <Link href="/session" className="text-sm text-gray-600 hover:text-chef-600 transition-colors">
            Ma session
          </Link>
          <Link href="/profil" className="text-sm text-gray-600 hover:text-chef-600 transition-colors">
            Profil
          </Link>
          <Link
            href="/connexion"
            className="text-sm bg-chef-500 text-white px-4 py-2 rounded-lg hover:bg-chef-600 transition-colors"
          >
            Connexion
          </Link>
        </nav>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
          <Link href="/recettes" className="block text-gray-600 py-2" onClick={() => setMenuOpen(false)}>
            Recettes
          </Link>
          <Link href="/session" className="block text-gray-600 py-2" onClick={() => setMenuOpen(false)}>
            Ma session
          </Link>
          <Link href="/profil" className="block text-gray-600 py-2" onClick={() => setMenuOpen(false)}>
            Profil
          </Link>
          <Link
            href="/connexion"
            className="block text-center bg-chef-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setMenuOpen(false)}
          >
            Connexion
          </Link>
        </nav>
      )}
    </header>
  );
}
