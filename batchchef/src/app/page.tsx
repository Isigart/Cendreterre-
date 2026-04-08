import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-6xl mb-6 block">🍳</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Ton Coach{" "}
              <span className="text-chef-500">Batch Cooking</span>
              <br />
              dans la Poche
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              20 recettes validées par un chef chaque semaine.
              <br />
              Moins de 3€ par repas. Guidage étape par étape.
              <br />
              <strong>Cuisiner une fois le weekend, manger bien toute la semaine.</strong>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/recettes"
                className="px-8 py-4 bg-chef-500 text-white rounded-xl font-bold text-lg hover:bg-chef-600 transition-colors shadow-lg shadow-chef-500/25"
              >
                Essayer gratuitement
              </Link>
              <a
                href="#comment"
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                Comment ça marche
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              2 semaines d&apos;essai gratuit · 9€/mois · Sans engagement
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment" className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            3 étapes, c&apos;est tout
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="font-bold text-lg text-gray-900">Chaque lundi</h3>
              <p className="mt-2 text-gray-600 text-sm">
                20 nouvelles recettes de saison, validées par un chef professionnel.
                Toutes à moins de 3€ par repas.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-4">👆</div>
              <h3 className="font-bold text-lg text-gray-900">Tu choisis 5</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Indique le nombre de personnes. L&apos;app calcule la durée optimale
                de ta session. Tu la fais quand tu veux.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-4">👨‍🍳</div>
              <h3 className="font-bold text-lg text-gray-900">Tu cuisines</h3>
              <p className="mt-2 text-gray-600 text-sm">
                L&apos;app te guide une tâche à la fois. Timers automatiques. Astuces
                du chef. Tu ne réfléchis plus — tu suis.
              </p>
            </div>
          </div>

          <p className="text-center mt-10 text-lg font-semibold text-sage-700">
            5 repas préparés, budget maîtrisé, zéro stress.
          </p>
        </div>
      </section>

      {/* The coaching experience */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Un coach, pas une appli de recettes
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
            BatchChef cache la complexité. Tu vois une tâche, un timer, une astuce,
            la prochaine étape. C&apos;est tout.
          </p>

          {/* Mock phone screen */}
          <div className="max-w-sm mx-auto bg-gray-900 rounded-3xl p-3 shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="bg-sage-50 px-6 py-8 text-center">
                <div className="text-sm text-sage-600 font-medium mb-1">
                  ⏳ En attente
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Blanquette sur feu doux
                </h3>
                {/* Timer mock */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e3eae2" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="54" fill="none" stroke="#587956" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray="339.3" strokeDashoffset="135"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-mono font-bold">18:32</span>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left mb-4">
                  <p className="text-sm text-amber-900">
                    💡 Pas besoin de surveiller, elle se débrouille seule. Profites-en pour te reposer !
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Ensuite → Préparer les poireaux
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* vs Hello Fresh */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Pourquoi pas Hello Fresh ?
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left text-gray-500 font-normal"></th>
                  <th className="p-4 text-center text-gray-400 font-normal">Hello Fresh</th>
                  <th className="p-4 text-center text-chef-600 font-bold">BatchChef</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Coût mensuel", "250–320€", "9€"],
                  ["Coût par repas", "8–12€", "< 3€"],
                  ["Choix recettes", "Imposées", "20 au choix"],
                  ["Organisation", "Recette par recette", "Batch optimisé"],
                  ["Guidage", "Instructions basiques", "Coach étape par étape"],
                ].map(([label, hf, bc], i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="p-4 text-gray-700 font-medium">{label}</td>
                    <td className="p-4 text-center text-gray-400">{hf}</td>
                    <td className="p-4 text-center text-gray-900 font-semibold">{bc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à cuisiner intelligemment ?
          </h2>
          <p className="text-gray-600 mb-8">
            Arrête de payer 300€/mois pour qu&apos;on choisisse tes repas à ta place.
            BatchChef te guide intelligemment pour 9€/mois — tu gardes le contrôle.
          </p>
          <Link
            href="/recettes"
            className="inline-block px-8 py-4 bg-chef-500 text-white rounded-xl font-bold text-lg hover:bg-chef-600 transition-colors shadow-lg shadow-chef-500/25"
          >
            Commencer mon essai gratuit
          </Link>
          <p className="mt-3 text-sm text-gray-400">
            2 semaines gratuites · Aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>🍳</span>
            <span className="font-bold text-white">BatchChef</span>
          </div>
          <p>Fait avec passion en Dordogne</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
